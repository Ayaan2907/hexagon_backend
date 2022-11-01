const insertFileData = require("../Models/insertNewData");
const getIndex = require("../Models/getUniqueIndices");
// const { FILE_DATA } = require("./fileData");

let fileSpecificProperties = {};

const insertIntoSubsetKeyTable = async (FILE_DATA) => {
    // FIXME: function giving sql error TRUNCATED INCORRECT DOUBLE VALUE FOR 'cl_name'
    const name = FILE_DATA.properties?.fileName.split("_");
    
    fileSpecificProperties.cl_number = Number(name[1].slice(0, -1));
    fileSpecificProperties.criticality = name[2];
    fileSpecificProperties.platform_type = name[3].includes("win") ? 2 : 1; // as per the discussion for windows platform type 2 for linux its 1
    
    
    const subsetKeyTableBody = [
        fileSpecificProperties.cl_number,
        0, // sample flag of coreTech
        fileSpecificProperties.platform_type,
    ];

    try {
        const result = await insertFileData.insertIntoTables(
            "subset_key_table",
            subsetKeyTableBody
        );
        console.log(result);
    } catch (err) {
        console.log(err);
    }
};

/**
 * The below function can be completely ignored for icreasing the performance of the application,
 * by manually inserting the module name and test name data into indexing tables.
 * Because following function iterates in the whole file data and
 * for each index it inserts into DB and ignores if already exists.
 *
 */
const insertIntoIndexingTables = async (FILE_DATA) => {
    // module_name_index, test_name_index tables
    let moduleNames = FILE_DATA?.data.data.map((item) => item.ModuleName);
    let testNames = FILE_DATA?.data.data.map((item) => item.TestName);

    // remove duplicates
    moduleNames = [...new Set(moduleNames)];
    testNames = [...new Set(testNames)];

    // insert into module_name_index table
    moduleNames.forEach(async (moduleName) => {
        const moduleNameIndexBody = [moduleName];
        try {
            const result = await insertFileData.insertIntoTables(
                "module_name_index",
                moduleNameIndexBody
            );
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    });

    // insert into test_name_index table
    testNames.forEach(async (testName) => {
        const testNameIndexBody = [testName];
        try {
            const result = await insertFileData.insertIntoTables(
                "test_name_index",
                testNameIndexBody
            );
            console.log(result);
        } catch (err) {
            console.log(err);
        }
    });
};

const allInsertionOperations = async (FILE_DATA) => {
    const getIndices = async (tableName, param) => {
        try {
            return await getIndex.getIndexByName(tableName, param);
        } catch (err) {
            console.log(err);
        }
    };

    let rowSpecificProperties = {};
    FILE_DATA?.data.data.map((row) => {
        rowSpecificProperties.moduleName = row.ModuleName;
        rowSpecificProperties.testName = row.TestName;
        rowSpecificProperties.fileType = row.FileType;
        rowSpecificProperties.Status = row.Status;
        rowSpecificProperties.Severity = row.Severity;
        (async () => {
            rowSpecificProperties.subsetKey = await getIndices("subsetKeyTable", [
                fileSpecificProperties.cl_number,
            ]);
            rowSpecificProperties.moduleIndex = await getIndices("moduleNameIndex", [
                rowSpecificProperties.moduleName,
            ]);
            rowSpecificProperties.testIndex = await getIndices("testNameIndex", [
                rowSpecificProperties.testName,
            ]);
            rowSpecificProperties.testCaseKey = await getIndices("testCaseKeyTable", [
                rowSpecificProperties.testIndex,
                rowSpecificProperties.moduleIndex,
                rowSpecificProperties.fileType,
            ]);
        })();

        const insertIntoTestCaseKeyTable = async () => {
            // test_case_key_table

            const testCaseKeyTableBody = [
                rowSpecificProperties.testIndex,
                rowSpecificProperties.moduleIndex,
                rowSpecificProperties.fileType,
            ];

            try {
                const result = await insertFileData.insertIntoTables(
                    "test_case_key_table",
                    testCaseKeyTableBody
                );
                console.log(result);
            } catch (err) {
                console.log(err);
            }
        };
        insertIntoTestCaseKeyTable();

        const insertIntoDetailsTable = async () => {
            // details_table

            const detailsTableBody = [
                rowSpecificProperties.testCaseKey,
                rowSpecificProperties.subsetKey,
                rowSpecificProperties.Status,
                "sample", //sample comment
                fileSpecificProperties.criticality,
                rowSpecificProperties.Severity,
                "LP_errors",
                1,
                2,
                3,
            ];
            /**
             * LP_errors, solid, sheet, point body errors are still not calculated,
             * complete the body of details table with the error values, currently adding sample values
             */

            try {
                const result = await insertFileData.insertIntoTables(
                    "details_table",
                    detailsTableBody
                );
                console.log(result);
            } catch (err) {
                console.log(err);
            }
        };
        insertIntoDetailsTable();
    });
};

// const insertIntoErrorSpecificTables = async () => {}

// derrive and insert error values into details table and respective error tables

module.exports = {
    insertIntoSubsetKeyTable,
    insertIntoIndexingTables,
    allInsertionOperations,
};
