var mysql = require('mysql2');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const DBConnection = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    insecureAuth: true
} 

const DBPool = mysql.createPool({
    ...DBConnection, typeCast: function (field, next) {
        if (field.type === "DECIMAL" || field.type === 'NEWDECIMAL') {
            var value = field.string();
            return (value === null) ? '' : Number(value);
        }
        return next();
    }
});

module.exports = DBPool.promise();