const express = require('express')
require('dotenv').config()
const cors = require('cors')
const mysql = require("mysql");
const APP_PORT = process.env.APP_PORT
const indexRoute = require('./Routes/index')


const app = express();


app.use(cors())
app.use(express.json())

app.use('/', indexRoute)
// app.use('/api/handleCsv', handleCsvRoute)


app.listen(APP_PORT, () => {
    console.log(`Server listening port ${APP_PORT}`)
});

// Creating a pool of connections to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    // host: HOST,
    port: process.env.DB_PORT,
    user: process.env.USR,
    password: process.env.PASSWORD,
    database: "nodejs_application",
    // database: process.env.DATABASE,
    connectionLimit: 10,
});

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            console.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            console.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
            console.error("Database connection was refused.");
        }
    }
    if (connection) connection.release();
    console.log(`Database connected at ${process.env.DB_HOST}:${process.env.DB_PORT}`)
    return;
});

module.exports = pool;