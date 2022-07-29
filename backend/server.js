const express = require('express')
const app = express()
const port = 3001
var DBPool = require('./database');
const path = require('path')
var session = require('express-session');
var bodyParser = require('body-parser');
var DBPool = require('./database');
const { upload } = require ('./multerconfig');


require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//the /uploads path will serve files in the uploads folder
app.use('/public/uploads', express.static('uploads'));

//controllers
var userController = require("./controllers/userController");
var recoveryController = require("./notifications/recoveryController"); //handles password recovery
var plantController = require("./controllers/plantController");  //handles plant table related calls
var classifierController = require("./controllers/classifierController");  //handles classifier related calls
var uploadsController = require("./controllers/uploadsController");  //handles upload related calls

//User endpoints
app.get('/api/users', userController.getUser);  //retrieves all users
app.get('/api/users/:id', userController.getUserID);  //retrieves specific user by id
app.get('/api/users/email/:email', userController.getUserEmail);  //retrieves specific user by email
app.get('/api/usertable', userController.getAdminTable);  //retreive users for the admin table
app.post('/api/users/updatepassword/:id/:password', userController.updatePassword); //Updates a single users password
app.post('/api/users/updateuser/:id/:firstname/:surname/:email/:password/:type', userController.updateUser); //Updates a users information
app.post("/api/users/archive/:id", userController.archiveUser)
app.post("/api/users/delete/:id", userController.deleteUser)

//Recovery endpoints
app.post('/api/recover/check/:email', recoveryController.checkEmail);   //checks an email exists
app.post('/api/recover/send/:id/:email', recoveryController.sendRecoveryEmail); //sends the recovery email to a specified email.

//Plants endpoints
app.get("/api/plants/admintable", plantController.getPlantsAdminTable);
app.get("/api/plants/:id", plantController.getPlantID);
app.get("/api/plants/getid/:commonname", plantController.getPlantIDByName);
app.post("/api/plants/archive/:id", plantController.archivePlant)
app.post("/api/plants/delete/:id", plantController.deletePlant)
app.post("/api/plants/update", plantController.UpdatePlant)
app.post("/api/plants/create", plantController.CreatePlant)
app.get("/api/plants/names/:id", plantController.getPlantNames)
app.post("/api/plants/names/deleteall/:id", plantController.deletePlantNames)
app.post("/api/plants/names/update/:id/", plantController.updatePlantNames)
app.get("/api/plants/search/:searchtext", plantController.searchPlants)
app.post("/api/garden/add/:plantid", userController.addToGarden)
app.post("/api/garden/delete/:plantid", userController.removeFromGraden)
app.get("/api/garden/check/:plantid", userController.checkGarden)
app.get("/api/garden/get/", userController.getGarden)


//classifier related endpoints
app.get("/api/getmodel", classifierController.getModel)

//uploads related endpoints
app.get("/api/plant/images/:id", uploadsController.getPlantImages)
app.post('/api/upload/:id', upload.single('plant-image'), uploadsController.UploadImageSingle);
app.delete("/api/plant/images/delete/:id/:path", uploadsController.deletePlantImage)

//Login/Session management routing 

/*
* POST the users SHA512 HASHED password and email to this server.
* Search all users in the database for these credentials
* If a match is found. Update session variable with their username.
* Else return false and handle the rest on the client side.
*/
app.post('/api/login/:email/:password', async function (request, response) {
    //get the email and password from the request
    var email = request.params.email;
    var password = request.params.password;
    let isAuthenticated = false;

    //if the email and password are not empty
    if (email && password) {
        const [results, fields] = await DBPool.query('SELECT * FROM user WHERE Email = ? AND Password = ?', [email, password]); //search for the user with that email and password.
        //if a user is found
        if (results.length > 0) {
            //update session variables
            request.session.loggedin = true;
            request.session.username = email;
            request.session.userID = results[0].UserID;
            isAuthenticated = true;
        }
    }
    response.send(isAuthenticated);
});

/* POST the users data when they fill out the register form */
app.post('/api/register/:email/:password/:firstname/:surname', async function (request, response) {
    //get the form details from the request
    var email = request.params.email;
    var password = request.params.password;
    var firstName = request.params.firstname;
    var surname = request.params.surname;
    var type = "User"   //default type is user. Doesnt come from form.

    //if all fields have been sent.
    if (email && password && firstName && surname) {
        try {
            const [results, fields] = await DBPool.query(`INSERT INTO user (FirstName, Surname, Email, Password, Type) VALUES (?, ?, ?, ?, ?);`, [firstName, surname, email, password, type]);
            //if the user was created successfully
            response.sendStatus(200);
        }
        catch (err) {
            response.send(err)
            console.log(err)
        }
    }
});


/*
* The req.session variable contains information about the logged in user
* Therefore if it contains a value, someone is logged in.
* If it does not contain any values (null/false) then the user is not logged in.
*/
app.get('/api/checkuser', function (req, res) {
    if (req.session.loggedin === true && req.session.username !== null) {
        res.send(req.session);
    }
    else {
        res.send(false);
    }
});

//checks the type of the logged in user
app.get('/api/usertype', async function (req, res) {
    var email = req.session.username;

    const [results, fields] = await DBPool.query('SELECT Type FROM user WHERE Email = ?;', [email]);
    try {
        res.send(results[0].Type);
    }
    catch (error) {
        console.log(error);
    }
});

/*
* Resets the contents of the session variable to indicate the user is not logged in.
*/
app.get('/api/logout', function (req, res) {
    req.session.loggedin = false;
    req.session.username = null;
    res.sendStatus(200);
}
);

app.listen(port, () => console.log(`Listening on port: ${port}`))

module.exports.app = app;