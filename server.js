const express = require('express')
const cors = require('cors')
const serverConfig = require('./config/config-variables')
const routerIndex = require('./Routes/index')

const APP_PORT = serverConfig.APP_PORT;
const ALLOWED_ORIGINS = serverConfig.ALLOWED_ORIGINS;

const app = express();

corsOptions = {
    origin: ALLOWED_ORIGINS,
    optionsSuccessStatus: 200
}

app.use(cors( corsOptions ))
app.use(express.json())

app.use('/api', routerIndex)

app.listen(APP_PORT, () => {
    console.log(`Server listening port ${APP_PORT}`)
});
