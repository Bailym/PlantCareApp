const express = require('express')
const app = express()
const port = 443
var DBPool = require('./database');
var session = require('express-session');
var bodyParser = require('body-parser');
var DBPool = require('./database');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//controllers

var userController = require("./controllers/testController");
const { message } = require('antd');

//routing
app.get('/api/users', userController.getUser);



//Login routing 

/*
* POST the users SHA512 HASHED password and email to this server.
* Search all users in the database for these credentials
* If a match is found. Update session variable with their username.
* Else return false and handle the rest on the client side.
*/
app.post('/api/login/:email/:password', async function (request, response) {
    var email = request.params.email;
    var password = request.params.password;
    if (email && password) {
        const [results, fields] = await DBPool.query('SELECT * FROM plantdb.user WHERE Email = ? AND Password = ?', [email, password]);
        if (results.length > 0) {
            request.session.loggedin = true;
            request.session.username = email;
            response.send(true);
        } else {
            response.send(false);
        }
        response.end();
    }
    else {
        response.send(false);
        response.end();
    }
});

app.post('/api/register/:email/:password/:firstname/:surname', async function (request, response) {
    var email = request.params.email;
    var password = request.params.password;
    var firstName = request.params.firstname;
    var surname = request.params.surname;
    var type= "User"
    if (email && password && firstName && surname) {

        try{
            const [results, fields] = await DBPool.query(`INSERT INTO plantdb.user (FirstName, Surname, Email, Password, Type) VALUES (?, ?, ?, ?, ?);`, [firstName, surname, email, password, type]);
            response.sendStatus(200);
        }
        catch(err){
            response.send(err)
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
        res.send(true);
    }
    else {
        res.send(false);
    }
}
);

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