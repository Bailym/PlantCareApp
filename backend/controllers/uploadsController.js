var DBPool = require('../database');
var fs = require("fs");
const { s3 } = require('../multerconfig');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

module.exports = {
    async UploadImageSingle(request, response, next) {

        const imagePath = request.file.path
        const blob = fs.readFileSync(imagePath)

        //S3 upload
        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: request.file.originalname,
            Body: blob,
        }).promise()
        //insert the image path into the database
        const [results, fields] = await DBPool.query("INSERT INTO image (ImagePath, S3Key, PlantID) VALUES (?,?,?)", [uploadedImage.Location, uploadedImage.Key, request.params.id]);
        response.sendStatus(200)
    },

    async getPlantImages(request, response) {


        try {
            let imagesData = [];
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT ImagePath, S3Key FROM image WHERE PlantID = ?`, request.params.id);

            for (var i = 0; i < results.length; i++) {
                var params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: results[i].S3Key };
                var promise = s3.getSignedUrlPromise('getObject', params);
                await promise.then(function (url) {
                    imagesData.push({ url: url, key: params.Key })
                }, function (err) { console.log(err) });
            }

            response.send(imagesData);
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
        const [results, fields] = await DBPool.query(`DELETE FROM image WHERE (PlantID = ? AND S3Key = ?)`, [request.params.id, request.params.key]);

        var params = { Bucket: process.env.AWS_S3_BUCKET_NAME, Key: request.params.key };

        //remove from S3 bucket.
        s3.deleteObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                response.send(err.code)
            } else {
                console.log("S3 image deleted " + request.params.key);
            }
        });

        response.sendStatus(200);
    },
}