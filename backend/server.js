const express = require('express')
const app = express()
const port = 443

//controllers

var userController = require("./controllers/testController");

//routing
app.get('/api/users', userController.getUser);




app.listen(port, () => console.log(`Listening on port: ${port}`))