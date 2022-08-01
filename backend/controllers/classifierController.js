const fs = require('fs');
const path = require ('path');

const classifierPath = path.resolve(__dirname, '../classifier.json');

module.exports = {

    async getModel(request, response) {
        //read the classifier file and send to the client
        fs.readFile(classifierPath, function (err, data) {
            if (err) {
                console.log(err.stack)
            }
            else {
                response.send(data);
            }
        });


    }

}



