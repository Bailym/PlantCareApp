let { app } = require("../backend/server");
const request = require("supertest");




beforeAll(() => {

    console.log("SETTING UP TESTS")
})

afterAll(async () => {

    console.log("TEARING DOWN TESTS")

    const userDetails = await request(app).get(`/api/users/email/test@email.co.uk`) //users details
    const plantDetails = await request(app).get(`/api/plants/getid/New Common Name`) //plant details

    //DELETE THE USER
    await request(app).post(`/api/users/delete/${userDetails.body[0].ID}`)
        .then(function (response, error) {
            expect(response.statusCode).toBe(200);
        })

    //DELTE THE PLANT NAMES
    await request(app).post(`/api/plants/names/deleteall/${plantDetails.body[0].PlantID}`)
        .then(function (response, error) {
            expect(response.statusCode).toBe(200);
        })

    //DELTE THE PLANT
    await request(app).post(`/api/plants/delete/${plantDetails.body[0].PlantID}`)
        .then(function (response, error) {
            expect(response.statusCode).toBe(200);
        })
});