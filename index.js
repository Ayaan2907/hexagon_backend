const express = require('express')
require('dotenv').config()
const APP_PORT = process.env.APP_PORT || 8080
const app = express();
// const pool = require('./Config/database_config')

app.get('/', (req, res)=>res.status(200).json('Hello World'));


app.listen(APP_PORT, () => {
    console.log(`Server listening port ${APP_PORT}`)
});
