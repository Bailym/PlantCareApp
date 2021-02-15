const fs = require('fs');

module.exports = {

    async getModel(request, response) {
        //read the classifier file and send to the client
        fs.readFile('classifier.json', function (err, data) {
            response.writeHead(200, { 'Content-Type': 'text/application' });
            response.write(data);
            response.end();
        });

    }

}

    

