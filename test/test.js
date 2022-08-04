/* eslint-disable no-undef */
let { app } = require("../backend/server");
const request = require("supertest");


//TODO: USE API ENDPOINTS TO RETRIEVE USERID AND PLANTID IN EACH TEST THAT NEEDS IT.

describe("Test Register Path /api/register/:email/:password/:firstname/:surname", () => {
    test("It should register a new user and get a 200 response code", async () => {
        const response = await request(app).post("/api/register/test@email.co.uk/testpassword123!/Api/Test")
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    });
    test("Check the registered user exists", async function () {

        //Check the new user exists in the users table
        const response = await request(app).get(`/api/users/email/test@email.co.uk`)
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
        expect(response.body[0].FirstName).toBe("Api");
        expect(response.body[0].Surname).toBe("Test");
        expect(response.body[0].Email).toBe("test@email.co.uk")
    });
})

describe("Test Login Path /api/login/:email/:password", () => {
    test("Should reveive a 200 response when logging in user", async function () {
        //Log the user in
        const response = await request(app).post(`/api/login/test@email.co.uk/testpassword123!`)
        expect(response.body).toBe(true);   //returns true of false
    })
})

describe("Test Update Password Path /api/users/updatepassword/:id/:password", () => {
    test("Users password should update", async function () {

        const userDetails = await request(app).get(`/api/users/email/test@email.co.uk`) //users details

        //Update the users password
        const response = await request(app).post(`/api/users/updatepassword/${userDetails.body[0].ID}/newPassword123!`)
        expect(response.statusCode).toBe(200)
    })

    test("Make sure user cant login with the old password", async function () {
        //Log the user in with the old password (FALSE)
        const response = await request(app).post(`/api/login/test@email.co.uk/testpassword123!`)
        expect(response.body).toBe(false)
    })

    test("Make sure user can login with the new password", async function () {
        //Log the user in with the new password (TRUE)
        const response = await request(app).post(`/api/login/test@email.co.uk/newPassword123!`)
        expect(response.body).toBe(true)
    })
})

describe("Test Update User Details Path /api/users/updateuser/:id/:firstname/:surname/:email/:password/:type", () => {

    test("Users details should update", async function () {
        const userDetails = await request(app).get(`/api/users/email/test@email.co.uk`) //users details

        //Change the users names
        const response = await request(app).post(`/api/users/updateuser/${userDetails.body[0].ID}/New/Name/test@email.co.uk/testpassword123!/User`)
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })

    test("Make sure the users details have been updated", async function () {

        const userDetails = await request(app).get(`/api/users/email/test@email.co.uk`) //users details

        //Check the new users names have changed
        const response = await request(app).get(`/api/users/${userDetails.body[0].ID}`)
        expect(response.body[0].ID).toBe(userDetails.body[0].ID)
        expect(response.body[0].FirstName).toBe("New")
        expect(response.body[0].Surname).toBe("Name")
        expect(response.body[0].Email).toBe("test@email.co.uk")
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })
})

describe("Test Create Plant Path /api/plants/create", () => {
    test("A new plant should be created with a response of 200", async function () {

        //Create a new plant
        var obj = {
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
            hardinessZones: "0-4",
            soilType: "Sandy",
            waterNeeds: "Water frequently until soil is saturated",
            fertilisationNeeds: "Once a month during growth",
            pruning: "Trim withered leaves",
            propagation: "Cutting",
            pests: "Aphids, Root rot",
            plantingTime: "Spring",
            harvestTime: "Autumn",
            pottingNeeds: "Needs good drainage",
            environmentalUses: "None",
            economicUses: "None",
            homeUses: "None"
        }

        const response = await request(app).post(`/api/plants/create`).send(obj)
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })


    test("The new plant should be found in the database", async function () {

        const plantDetails = await request(app).get(`/api/plants/getid/New Plant`) //plant details

        //Check the new plant exists in the plants table
        const response = await request(app).get(`/api/plants/${plantDetails.body[0].PlantID}`)
        expect(response.body[0].PlantID).toBe(plantDetails.body[0].PlantID)
        expect(response.body[0].CommonName).toBe("New Plant")
        expect(response.body[0].Type).toBe("Shrub")
        expect(response.body[0].NativeCountry).toBe("Test Country")
        expect(response.body[0].Symbolism).toBe("Test Symbolism")
        expect(response.body[0].EndangeredStatus).toBe("Not Endangered")
        expect(response.body[0].EnvironmentalThreat).toBe("None")
        expect(response.body[0].LifeSpan).toBe("Test")
        expect(response.body[0].BloomTime).toBe("Spring")
        expect(response.body[0].SizeRange).toBe("Test")
        expect(response.body[0].Spread).toBe("Test")
        expect(response.body[0].FlowerSize).toBe("None")
        expect(response.body[0].Difficulty).toBe("Hard")
        expect(response.body[0].SunlightNeeds).toBe("Full sun")
        expect(response.body[0].Hardiness).toBe("-40")
        expect(response.body[0].HardinessZones).toBe("0-4")
        expect(response.body[0].SoilType).toBe("Sandy")
        expect(response.body[0].WaterNeeds).toBe("Water frequently until soil is saturated")
        expect(response.body[0].FertilisationNeeds).toBe("Once a month during growth")
        expect(response.body[0].Pruning).toBe("Trim withered leaves")
        expect(response.body[0].Propagation).toBe("Cutting")
        expect(response.body[0].Pests).toBe("Aphids, Root rot")
        expect(response.body[0].PlantingTime).toBe("Spring")
        expect(response.body[0].HarvestTime).toBe("Autumn")
        expect(response.body[0].PottingNeeds).toBe("Needs good drainage")
        expect(response.body[0].EnvironmentalUses).toBe("None")
        expect(response.body[0].EconomicUses).toBe("None")
        expect(response.body[0].HomeUses).toBe("None")
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })
})

describe("Test Update Plant Details Path /api/plants/update", () => {
    test("The plant should be updated with a response of 200", async function () {

        const plantDetails = await request(app).get(`/api/plants/getid/New Plant`) //plant details

        //change some values
        var obj = {
            plantID: plantDetails.body[0].PlantID,
            commonName: "New Common Name",
            type: "Herb",
            nativeCountry: "West Africa",
            symbolism: "Luck",
            endangeredStatus: "Endangered",
            environmentalThreat: "None",
            lifeSpan: "Test",
            bloomTime: "Spring",
            sizeRange: "Test",
            spread: "Test",
            flowerSize: "None",
            difficulty: "Hard",
            sunlightNeeds: "Full sun",
            hardiness: "-40",
            hardinessZones: "0-4",
            soilType: "Sandy",
            waterNeeds: "Water frequently until soil is saturated",
            fertilisationNeeds: "Once a month during growth",
            pruning: "Trim withered leaves",
            propagation: "Cutting",
            pests: "Aphids, Root rot",
            plantingTime: "Spring",
            harvestTime: "Autumn",
            pottingNeeds: "Needs good drainage",
            environmentalUses: "None",
            economicUses: "None",
            homeUses: "None"
        }

        //Change the plant details
        const response = await request(app).post(`/api/plants/update`).send(obj)
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })

    test("The updated plant details should be found in the database", async function () {

        const plantDetails = await request(app).get(`/api/plants/getid/New Common Name`) //plant details

        //Check the plants details have been changed
        const response = await request(app).get(`/api/plants/${plantDetails.body[0].PlantID}`)
        expect(response.body[0].CommonName).toBe("New Common Name")
        expect(response.body[0].Type).toBe("Herb")
        expect(response.body[0].NativeCountry).toBe("West Africa")
        expect(response.body[0].Symbolism).toBe("Luck")
        expect(response.body[0].EndangeredStatus).toBe("Endangered")
        expect(response.body[0].EnvironmentalThreat).toBe("None")
        expect(response.body[0].LifeSpan).toBe("Test")
        expect(response.body[0].BloomTime).toBe("Spring")
        expect(response.body[0].SizeRange).toBe("Test")
        expect(response.body[0].Spread).toBe("Test")
        expect(response.body[0].FlowerSize).toBe("None")
        expect(response.body[0].Difficulty).toBe("Hard")
        expect(response.body[0].SunlightNeeds).toBe("Full sun")
        expect(response.body[0].Hardiness).toBe("-40")
        expect(response.body[0].HardinessZones).toBe("0-4")
        expect(response.body[0].SoilType).toBe("Sandy")
        expect(response.body[0].WaterNeeds).toBe("Water frequently until soil is saturated")
        expect(response.body[0].FertilisationNeeds).toBe("Once a month during growth")
        expect(response.body[0].Pruning).toBe("Trim withered leaves")
        expect(response.body[0].Propagation).toBe("Cutting")
        expect(response.body[0].Pests).toBe("Aphids, Root rot")
        expect(response.body[0].PlantingTime).toBe("Spring")
        expect(response.body[0].HarvestTime).toBe("Autumn")
        expect(response.body[0].PottingNeeds).toBe("Needs good drainage")
        expect(response.body[0].EnvironmentalUses).toBe("None")
        expect(response.body[0].EconomicUses).toBe("None")
        expect(response.body[0].HomeUses).toBe("None")
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })
})

describe("Test Update Plant Names Path /api/plants/names/update/:id", () => {
    test("The plant names should be updated with a response of 200", async function () {

        var plantNames = ["Plant Name One", "Plant Name Two", "Plant Name Three"] //plant names

        const plantDetails = await request(app).get(`/api/plants/getid/New Common Name`) //plant details

        //Change the plant details
        const response = await request(app).post(`/api/plants/names/update/${plantDetails.body[0].PlantID}`).send(plantNames)
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code
    })

    test("The updated plant names should be found in the database", async function () {

        const plantDetails = await request(app).get(`/api/plants/getid/New Common Name`) //plant details

        //Check the plants names have been changed
        const response = await request(app).get(`/api/plants/names/${plantDetails.body[0].PlantID}`)
        expect(response.body[0].AltName).toBe("Plant Name One")
        expect(response.body[1].AltName).toBe("Plant Name Two")
        expect(response.body[2].AltName).toBe("Plant Name Three")
        expect(response.body.code).toBe(undefined); //sql error code
        expect(response.statusCode).toBe(200);  //http response code   
    })
})




