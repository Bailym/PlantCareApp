var mysql = require('mysql2');
var DBPool = require('../database');



module.exports = {

    async getAdminTable(request, response) {

        try {
            
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT UserID as "key", UserID as ID, FirstName, Surname, Email, Type FROM user`);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getUser(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT UserID as ID, FirstName, Surname, Email, Password, Type FROM user`);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getUserID(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT UserID as ID, FirstName, Surname, Email, Password, Type FROM user WHERE UserID = ?`, request.params.id);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getUserEmail(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT UserID as ID, FirstName, Surname, Email, Password, Type FROM user WHERE Email = ?`, request.params.email);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    //ONLY USED IN INTEGRATION TETSING TO REMOVE TEST DATA. ARCHIVE LIVE USERS BELOW
    async deleteUser(request, response) {

        try {
            //delete the original
            await DBPool.query(`DELETE FROM user WHERE UserID = ?`, request.params.id);

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },


    async archiveUser(request, response) {

        try {

            //insert the row into the archive
            await DBPool.query(`INSERT INTO userArchive (UserID, FirstName, Surname, Email, Password, Type) 
                SELECT * FROM user WHERE UserID = ?`, request.params.id);
            //delete the original
            await DBPool.query(`DELETE FROM user WHERE UserID = ?`, request.params.id);

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    async updateUser(request, response){

        try {
            //make query and send results
            await DBPool.query("UPDATE user SET FirstName = ?, Surname = ?, Email = ?, Password = ?, Type = ? WHERE (UserID = ?)",
             [request.params.firstname, request.params.surname, request.params.email,request.params.password, request.params.type, request.params.id]);

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }


    },

    async updatePassword(request, response){

        try {
            //make query and send results
            await DBPool.query("UPDATE user SET Password = ? WHERE (UserID = ?)", [request.params.password, request.params.id]);
            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async addToGarden(request, response){

        try {
            //make query and send results
            await DBPool.query("INSERT INTO gardenItem (UserID, PlantID) VALUES ('?','?')", [request.session.userID, parseInt(request.params.plantid)]);
            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async removeFromGraden(request, response){

        try {
            //make query and send results
            await DBPool.query("DELETE FROM gardenItem WHERE UserID = ? AND PlantID = ?", [request.session.userID, parseInt(request.params.plantid)]);
            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async checkGarden(request, response){

        try {
            //make query and send results
            const [results, fields] = await DBPool.query("SELECT * FROM gardenItem WHERE UserID = ? && PlantID = ?", [request.session.userID, parseInt(request.params.plantid)]);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }

    },

    async getGarden(request, response){

        if(request.session.userID){
            try {
                //make query and send results
                const [results, fields] = await DBPool.query("SELECT * FROM gardenItem WHERE UserID = ?", request.session.userID);
                response.send(results);
            }
            //error handling
            catch (err) {
                response.sendStatus(500);
                console.log(err)
            }
        }
        else{
            response.sendStatus(500);
        }
        

    }


}