const mysql = require("mysql");
require('dotenv').config()
const {DB_CONNECTION_LIMIT,DB_NAME,DB_HOST,DB_PASSWORD,DB_USERNAME} = process.env;
const sqlpool = mysql.createPool({
    connectionLimit: DB_CONNECTION_LIMIT,
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
});

module.exports = sqlpool;
