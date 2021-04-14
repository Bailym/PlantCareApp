/* eslint-disable no-undef */
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("../backend/server");
let app = server.app;
var agent = chai.request.agent(app);

suite("INTEGRATION TESTS", async function () {

    var newUserID = null

    test("Test Register Path /api/register/:email/:password/:firstname/:surname", async function () {

        //Register a new user with the following credentials 
        await agent.post(`/api/register/test@email.co.uk/testpassword123!/Api/Test`)
            .then(function (response, error) {
                newUserID = response.body.LastID
                chai.assert.equal(response.statusCode, 200, "Error Registering User!")
            })


        //Check the new user exists in the users table
        await agent.get(`/api/users/${newUserID}`)
            .then(function (response, error) {
                chai.assert.equal(response.body[0].ID, newUserID, "User Not Registered!")
                chai.assert.equal(response.body[0].FirstName, "Api", "User Not Registered!")
                chai.assert.equal(response.body[0].Surname, "Test", "User Not Registered!")
                chai.assert.equal(response.body[0].Email, "test@email.co.uk", "User Not Registered!")
            })
    })

    test("Test Login Path /api/login/:email/:password", async function () {

        //Log the user in
        await agent.post(`/api/login/test@email.co.uk/testpassword123!`)
            .then(function (response, error) {
                chai.assert.equal(response.body, true, "Error Logging in User!")
            })
    })

    suiteTeardown("Suite Teardown - Remove any Created Entities", async function () {

        await agent.post(`/api/users/delete/${newUserID}`)
            .then(function (response, error) {
                chai.assert.equal(response.statusCode, 200, "Error Deleting User")
            })

    })
})


