var multer = require('multer')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const AWS = require('aws-sdk');

//multer image storage setup. Use this to parse an image and send ot the server with correct headers.
var storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: "eu-west-2",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.upload = multer({ storage: storage })   //export to be used on server and controllers
exports.s3 = s3
