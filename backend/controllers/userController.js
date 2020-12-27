var mysql = require('mysql2');
var DBPool = require('../database');



module.exports = {

    async getAdminTable(request, response) {

        try {
            
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT UserID as "key", UserID as ID, FirstName, Surname, Email, Type FROM plantdb.user`);
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
            const [results, fields] = await DBPool.query(`SELECT UserID as ID, FirstName, Surname, Email, Password, Type FROM plantdb.user`);
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
            const [results, fields] = await DBPool.query(`SELECT UserID as ID, FirstName, Surname, Email, Password, Type FROM plantdb.user WHERE UserID = ?`, request.params.id);
            response.send(results);
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
            await DBPool.query(`INSERT INTO plantdb.userArchive (UserID, FirstName, Surname, Email, Password, Type) 
                SELECT * FROM plantdb.user WHERE UserID = ?`, request.params.id);
            //delete the original
            await DBPool.query(`DELETE FROM plantdb.user WHERE UserID = ?`, request.params.id);

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
            await DBPool.query("UPDATE plantdb.user SET FirstName = ?, Surname = ?, Email = ?, Password = ?, Type = ? WHERE (UserID = ?)",
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
            await DBPool.query("UPDATE plantdb.user SET Password = ? WHERE (UserID = ?)", [request.params.password, request.params.id]);

            response.sendStatus(200);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }


    }

}