module.exports = {
    // App config vars
    APP_PORT: "PORT number", 
    ALLOWED_ORIGINS: "*",
    
    // Database config vars
    DB_HOST: "localhost",
    DB_USER: "root", //any desired user
    DB_PASSWORD: "<password of database your user> ",
    DATABASE: "rtest_analysis_tool",//can be changed but first change in mysql script
    DB_PORT: 3306, // constant for mysql at almost every system
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};