var mysql = require('mysql2');

const DBConnection = {
    host: "plantcaredbinstance.c0yzynysedfz.eu-west-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "MA24xW#4E2NKJ%WSNxaJMIgAt49#Rz",
    database: "plantdb",
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