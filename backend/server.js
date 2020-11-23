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

//routing
app.get('/api/users', userController.getUser);









//Login routing 
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




app.listen(port, () => console.log(`Listening on port: ${port}`))