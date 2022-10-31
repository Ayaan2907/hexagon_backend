const insertFileData = require("../Models/insertNewData");
const getIndex = require("../Models/getUniqueIndices");
// const { FILE_DATA } = require("./fileData");

let derivedProperties = {};
const name = FILE_DATA.properties?.fileName.split("_");

derivedProperties.cl_number = Number(name[1].slice(0, -1));
derivedProperties.criticality = name[2];
derivedProperties.platform_type = name[3].includes("win") ? 2 : 1; // as per the discussion for windows platform type 2 for linux its 1

const insertIntoSubsetKeyTable = async (FILE_DATA) => {
    // FIXME: function giving sql error TRUNCATED INCORRECT DOUBLE VALUE FOR 'cl_name'

    const subsetKeyTableBody = [
        derivedProperties.cl_number,
        0, // sample flag of coreTech
        derivedProperties.platform_type,
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

const insertIntoTestCaseKeyTable = async (FILE_DATA) => {
    // test_case_key_table
    let testCaseKeyTableBody = [];
    let extractedFields = {};
    FILE_DATA?.data.data.forEach(async (item) => {
        extractedFields.moduleName = item.ModuleName;
        extractedFields.testName = item.TestName;
        extractedFields.fileType = item.FileType;
    });

    // store index instead of names
    try {
        extractedFields.moduleIndex = await getIndex.getIndexByName(
            "moduleNameIndex",
            extractedFields.moduleName
        );
    } catch (err) {
        console.log(err);
    }

    try {
        extractedFields.testIndex = await getIndex.getIndexByName(
            "testNameIndex",
            extractedFields.testName
        );
    } catch (err) {
        console.log(err);
    }

    testCaseKeyTableBody = [
        extractedFields.testIndex,
        extractedFields.moduleIndex,
        extractedFields.fileType,
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

const insertIntoDetailsTable = async (FILE_DATA) => {
    // details_table
    let extractedFields = {};
    FILE_DATA?.data.data.forEach(async (item) => {
        extractedFields.moduleName = item.ModuleName;
        extractedFields.testName = item.TestName;
        extractedFields.fileType = item.FileType;
        extractedFields.Status = item.Status;
        extractedFields.Severity = item.Severity;
    });

    // get subset key based on cl_number
    try {
        let clNumber = FILE_DATA.properties.fileName.split("_")[1];
        clNumber = Number(clNumber.slice(0, -1));
        extractedFields.subsetKey = await getIndex.getIndexByName(
            "subsetKeyTable",
            clNumber
        );
    } catch (err) {
        console.log(err);
    }

    // get test case key based on module index and test index. So again first get the indices based on names
    try {
        extractedFields.moduleIndex = await getIndex.getIndexByName(
            "moduleNameIndex",
            extractedFields.moduleName
        );
    } catch (err) {
        console.log(err);
    }

    try {
        extractedFields.testIndex = await getIndex.getIndexByName(
            "testNameIndex",
            extractedFields.testName
        );
    } catch (err) {
        console.log(err);
    }

    try {
        extractedFields.testCaseKey = await getIndex.getIndexByName(
            "testCaseKeyTable",
            [
                extractedFields.testIndex,
                extractedFields.moduleIndex,
                extractedFields.fileType,
            ]
        );
    } catch (err) {
        console.log(err);
    }

    detailsTableBody = [
        extractedFields.testCaseKey,
        extractedFields.subsetKey,
        extractedFields.Status,
        "sample", //sample comment
        derivedProperties.criticality,
        extractedFields.Severity,
        /**
         * LP_errors, solid, sheet, point body errors are still not calculated,
         * complete the body of details table with the error values, currently adding sample values
         */
        "LP_errors",
        1,
        2,
        3,
    ];

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

// derrive and insert error values into details table and respective error tables

module.exports = {
    insertIntoSubsetKeyTable,
    insertIntoTestCaseKeyTable,
    insertIntoIndexingTables,
    insertIntoDetailsTable,
};
