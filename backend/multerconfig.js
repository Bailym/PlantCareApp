var multer = require('multer')

//multer image storage setup.
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
exports.upload = multer({ storage: storage })   //export to be used on server and controllers
