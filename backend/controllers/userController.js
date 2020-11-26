var mysql = require('mysql2');
var DBPool = require('../database');



module.exports = {

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