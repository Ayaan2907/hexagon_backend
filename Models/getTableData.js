const pool = require("../config/databaseConfig");

const getSingleTableRecord = async (tableName) => {
    let promise = new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM ${tableName}`, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
    return promise;
};

module.exports = {
    getSingleTableRecord,
};
