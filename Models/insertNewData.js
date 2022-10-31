const pool = require('../config/databaseConfig');
const INSERTION_QUERIES = {
    module_name_index: `INSERT IGNORE INTO module_name_index (module_name) VALUES (?)`,
    subset_key_table: `INSERT INTO subset_key_table (cl_number, core_tech_flag, platform_type)VALUES (?,?,?)`,
    test_case_key_table: `INSERT INTO test_case_key_table (test_name, module_name_index, file_type) VALUES(?, ?, ?)`,
    module_comments: `INSERT INTO module_comments(module_name_index, unique_subset_key, comment_message)VALUES (?, ?, ?)`,
    details: `INSERT INTO details ( id, unique_test_key, unique_subset_key, status, comment, criticality, severity, lp_error, solid_change_error, sheet_error, point_body_error) VALUES (?,?,?,?,?,?,?,?,?,?,? )`,
    // insertIntoErrorTables: {
    error_solid_change: `INSERT INTO error_solid_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_sheet_change: `INSERT INTO error_sheet_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_point_body_change: `INSERT INTO error_point_body_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_wire_body_change: `INSERT INTO error_wire_body_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_general_body_change: `INSERT INTO error_general_body_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_face_change: `INSERT INTO error_face_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_edge_change: `INSERT INTO error_edge_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_volume_change: `INSERT INTO error_volume_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    error_surface_area_change: `INSERT INTO error_surface_area_change (unique_test_key, unique_subset_key, baseline_values, current_values) VALUES (?,?,?,?)`,
    // }
};
const insertIntoTables = async (tableName, body) => {
    return new Promise((resolve, reject) => {
        pool.query(INSERTION_QUERIES[tableName], body, (err, result) => {
            if (err) {
                reject(err);
            }
            resolve(result);
        });
    });
};


module.exports = {
    insertIntoTables,
};