const mysql = require("mysql");
const DbConfig = require('./config-variables');

// Creating a pool of connections to the database
const pool = mysql.createPool({
    host: DbConfig.DB_HOST,
    port: DbConfig.DB_PORT,
    user: DbConfig.DB_USER,
    password: DbConfig.DB_PASSWORD,
    database: DbConfig.DATABASE,
    connectionLimit: DbConfig.pool.max,
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
    console.log(`Database connected at ${DbConfig.DB_HOST}:${DbConfig.DB_PORT}`)
    return;
});

module.exports = pool;