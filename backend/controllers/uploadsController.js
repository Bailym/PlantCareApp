var DBPool = require('../database');
var fs = require("fs");

module.exports = {
    async UploadImageSingle (request, response, next) {
        //insert the image path into the database
        const [results, fields] = await DBPool.query("INSERT INTO plantdb.image (ImagePath, PlantID) VALUES (?,?)",[request.file.filename, request.params.id]);
        response.sendStatus(200)
    },

    async getPlantImages(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT ImagePath FROM plantdb.image WHERE PlantID = ?`, request.params.id);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
            console.log(err)
        }
    },

    //remove an image from db and uploads folders.
    async deletePlantImage(request, response) {

        //remove from the db
        const [results, fields] = await DBPool.query(`DELETE FROM plantdb.image WHERE (PlantID = ? AND ImagePath = ?)`, [request.params.id, request.params.path]);

        //delete the file from uploads (path is relative to server.js)
        var filePath = "../public/uploads/" + request.params.path;
        fs.unlinkSync(filePath);

        response.sendStatus(200);
    },

}