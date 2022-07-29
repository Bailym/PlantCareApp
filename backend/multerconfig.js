var multer = require('multer')
const path = require('path')
const imgPath = path.join(__dirname, '../public/uploads');
//multer image storage setup.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
exports.upload = multer({ storage: storage })   //export to be used on server and controllers
