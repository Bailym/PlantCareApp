var mysql = require('mysql2');
var DBPool = require('../database');
var nodemailer = require('nodemailer');
const path = require("path")
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })

module.exports = {

    //Checks if a given email exists in the databse
    async checkEmail(request, response) {

        try {
            //make query and send results
            const [results, fields] = await DBPool.query(`SELECT * FROM plantdb.user WHERE Email = ?`, request.params.email);
            response.send(results);
        }
        //error handling
        catch (err) {
            response.sendStatus(500);
        }

    },

    //sends the recover email out. Embedded in the email is a link containing the users ID. This allows them to follow a unique link to reset their password
    async sendRecoveryEmail(req, res) {
        try {

          let app_url = process.env.APP_URL;
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              type: "OAuth2",
              user: process.env.RECOVERY_EMAIL_ADDRESS,
              accessToken: process.env.GOOGLE_OAUTH_ACCESS_TOKEN,
              refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
              clientId: process.env.GOOGLE_API_CLIENT_ID,
              clientSecret : process.env.GOOGLE_API_CLIENT_SECRET
            },
          });

      
          var mailOptions = {

            from: 'arecovery227@gmail.com',
            to: req.params.email, 
            subject: `Account Recovery for ` + req.params.email,
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Recovery</title>
            </head>
            <body>
            
                <h1>An account recovery request has been made for this account.</h1>
                <h1>Click the link below to reset your password</h1>
                <a href = "${app_url}/updatepassword?id=${req.params.id}">Reset Password</a>
                
            </body>
            </html>`
          };
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log('Recovery Email sent');
            }
          });
        }
        catch (error) {
          console.log(error);
        }
      
      }


}