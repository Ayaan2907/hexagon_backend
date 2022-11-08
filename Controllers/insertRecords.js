const { insertIntoTables } = require("../Models/insertNewData");
const { getIndexByName } = require("../Models/getUniqueIndices");

let fileSpecificProperties = {};

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
        await insertIntoTables("module_name_index", moduleNameIndexBody)
            .then((res) => {
                // console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

const insertIntoSubsetKeyTable = async (FILE_DATA) => {
    // FIXME: function giving sql error TRUNCATED INCORRECT DOUBLE VALUE FOR 'cl_name'
    // Resolve the error first to insert data.

    const name = FILE_DATA.properties?.fileName.split("_");

    fileSpecificProperties.cl_number = Number(name[1]);
    fileSpecificProperties.criticality = Number(name[2]);
    fileSpecificProperties.platform_type = name[3]?.includes("win") ? 2 : 1; // as per the discussion for windows platform type 2 for linux its 1
    const subsetKeyTableBody = [
        fileSpecificProperties.cl_number,
        0, // sample flag of coreTech
        fileSpecificProperties.platform_type,
    ];
    await insertIntoTables("subset_key_table", subsetKeyTableBody)
        .then((res) => {
            // console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
};

// insert into test_name_index table
testNames.forEach(async (testName) => {
    const testNameIndexBody = [testName];
    await insertIntoTables("test_name_index", testNameIndexBody)
        .then((res) => {
            // console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
});

const allInsertionOperations = async (FILE_DATA) => {
    const getIndices = async (tableName, param) => {
        await getIndexByName(tableName, param)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    let rowSpecificProperties = {};
    FILE_DATA?.data.data.map((row) => {
        rowSpecificProperties.moduleName = row.ModuleName;
        rowSpecificProperties.testName = row.TestName;
        rowSpecificProperties.fileType = row.FileType;
        rowSpecificProperties.Status = row.Status;
        rowSpecificProperties.Severity = row.Severity;
        (async () => {
            rowSpecificProperties.subsetKey = await getIndices(
                "subsetKeyTable",
                [fileSpecificProperties.cl_number]
            );
            rowSpecificProperties.moduleIndex = await getIndices(
                "moduleNameIndex",
                [rowSpecificProperties.moduleName]
            );
            rowSpecificProperties.testIndex = await getIndices(
                "testNameIndex",
                [rowSpecificProperties.testName]
            );
            rowSpecificProperties.testCaseKey = await getIndices(
                "testCaseKeyTable",
                [
                    rowSpecificProperties.testIndex,
                    rowSpecificProperties.moduleIndex,
                    rowSpecificProperties.fileType,
                ]
            );
        })();

        const insertIntoTestCaseKeyTable = async () => {
            // test_case_key_table

            const testCaseKeyTableBody = [
                rowSpecificProperties.testIndex,
                rowSpecificProperties.moduleIndex,
                rowSpecificProperties.fileType,
            ];

            await insertIntoTables("test_case_key_table", testCaseKeyTableBody)
                .then((res) => {
                    // console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
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
            await insertIntoTables("details_table", detailsTableBody)
                .then((res) => {
                    // console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
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
