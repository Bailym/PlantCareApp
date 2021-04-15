/* eslint-disable no-undef */
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("../backend/server");
let app = server.app;
var agent = chai.request.agent(app);

suite("INTEGRATION TESTS", async function () {

    var newUserID = null
    var newPlantID = null

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

    test("Test Update Password Path /api/users/updatepassword/:id/:password", async function () {

        //Update the users password
        await agent.post(`/api/users/updatepassword/${newUserID}/newPassword123!`)
            .then(function (response, error) {
                chai.assert.equal(response.statusCode, 200, "Error Registering User!")
            })

        //Log the user in with the old password (FALSE)
        await agent.post(`/api/login/test@email.co.uk/testpassword123!`)
            .then(function (response, error) {
                chai.assert.equal(response.body, false, "Error Updating Users Password!")
            })

        //Log the user in with the new password (TRUE)
        await agent.post(`/api/login/test@email.co.uk/newPassword123!`)
            .then(function (response, error) {
                chai.assert.equal(response.body, true, "Error Updating Users Password!")
            })
    })

    test("Test Update User Details Path /api/users/updateuser/:id/:firstname/:surname/:email/:password/:type", async function () {

        //Change the users names
        await agent.post(`/api/users/updateuser/${newUserID}/New/Name/test@email.co.uk/testpassword123!/User`)
            .then(function (response, error) {
                chai.assert.equal(response.statusCode, 200, "Error Updating User!")
            })


        //Check the new users names have changed
        await agent.get(`/api/users/${newUserID}`)
            .then(function (response, error) {
                chai.assert.equal(response.body[0].ID, newUserID, "User Not Registered!")
                chai.assert.equal(response.body[0].FirstName, "New", "User Not Registered!")
                chai.assert.equal(response.body[0].Surname, "Name", "User Not Registered!")
                chai.assert.equal(response.body[0].Email, "test@email.co.uk", "User Not Registered!")
            })
    })

    test("Test Create Plant Path /api/plants/create", async function () {

        //Create a new plant

        // request.body.commonName, request.body.type, request.body.nativeCountry, request.body.symbolism, 
        // request.body.endangeredStatus, request.body.environmentalThreat, request.body.lifeSpan, request.body.bloomTime,
        // request.body.sizeRange, request.body.spread, request.body.flowerSize, request.body.difficulty, request.body.sunlightNeeds,
        // request.body.hardiness, request.body.hardinessZones, request.body.soilType, request.body.waterNeeds, request.body.fertilisationNeeds, 
        //request.body.pruning, request.body.propagation, request.body.pests, request.body.plantingTime, request.body.harvestTime,
        // request.body.pottingNeeds, request.body.environmentalUses, request.body.economicUses, request.body.homeUses

        let obj = {
            commonName: "New Plant",
            type: "Shrub",
            nativeCountry: "Test Country",
            symbolism: "Test Symbolism",
            endangeredStatus: "Not Endangered",
            environmentalThreat: "None",
            lifeSpan: "Test",
            bloomTime: "Spring",
            sizeRange: "Test",
            spread: "Test",
            flowerSize: "None",
            difficulty: "Hard",
            sunlightNeeds: "Full sun",
            hardiness: "-40",
            hardinessZones:"0-4",
            soilType:"Sandy",
            waterNeeds:"Water frequently until soil is saturated",
            fertilisationNeeds:"Once a month during growth",
            pruning:"Trim withered leaves",
            propagation:"Cutting",
            pests:"Aphids, Root rot",
            plantingTime: "Spring",
            harvestTime: "Autumn",
            pottingNeeds:"Needs good drainage",
            environmentalUses:"None",
            economicUses:"None",
            homeUses:"None"
        }
        await agent.post(`/api/plants/create`).send(obj)
            .then(function (response, error) {
                newPlantID = response.body.LastID
                chai.assert.equal(response.statusCode, 200, "Error Creating Plant!")
            })

         //Check the new plant exists in the users table
        await agent.get(`/api/plants/${newPlantID}`)
            .then(function (response, error) {
                chai.assert.equal(response.body[0].PlantID, newPlantID, "Plant not Created!")
                chai.assert.equal(response.body[0].CommonName, "New Plant", "Plant not Created!")
                chai.assert.equal(response.body[0].Type, "Shrub", "Plant not Created!")
            }) 
    })


    suiteTeardown("Suite Teardown - Remove any Created Entities", async function () {

        //DELETE THE USER
        await agent.post(`/api/users/delete/${newUserID}`)
            .then(function (response, error) {
                chai.assert.equal(response.statusCode, 200, "Error Deleting User")
            })

        //DELTE THE PLANT
        await agent.post(`/api/plants/delete/${newPlantID}`)
            .then(function (response, error) {
                chai.assert.equal(response.statusCode, 200, "Error Deleting Plant")
            })

    })
})


