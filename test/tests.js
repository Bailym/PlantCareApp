/* eslint-disable no-undef */
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("../backend/server");
let app = server.app;
var agent = chai.request.agent(app);

suite("INTEGRATION TESTS", async function () {

    test("Test Login Path /api/register/:email/:password/:firstname/:surname", async function () {

        await agent.post(`/api/register/test@email.co.uk/testpassword123!/Api/Test`)
            .then(function (response, error) {
                chai.assert.equal(response.statusCode, 200, "Error Registering User!")
            })
    })
})


