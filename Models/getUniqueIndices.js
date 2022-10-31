const pool = require("../config/databaseConfig");

const Queries = {
    moduleNameIndex: `SELECT module_index FROM module_name_index WHERE module_name = ?`,
    testNameIndex: `SELECT test_index FROM test_name_index WHERE test_name = ?`,
    subsetKeyTable: `SELECT unique_subset_key FROM subset_key_table WHERE cl_number = ?`,
    testCaseKeyTable: `SELECT unique_test_key FROM test_case_key_table WHERE test_name_index = ? AND module_name_index = ? AND file_type = ?`,
};

const getIndexByName = async (tableName, body) => {
    return new Promise((resolve, reject) => {
        pool.query(Queries[tableName], body, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
}

module.exports = {
    getIndexByName,
};


