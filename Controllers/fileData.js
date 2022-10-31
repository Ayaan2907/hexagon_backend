const insertFileData = require('../Models/insertNewData');
const insertFunctions = require('../Controllers/insertRecords');

let FILE_DATA = {};

const handleFileData = (req, res, db) => {
    if (req.body){
        FILE_DATA = req.body;
        console.log(FILE_DATA);
        res.status(200).json("file data received");
        insertFunctions.insertIntoSubsetKeyTable(FILE_DATA);
        // insertFunctions.insertIntoIndexingTables(FILE_DATA); // see comment in the function
        insertFunctions.insertIntoTestCaseKeyTable(FILE_DATA);
        insertFunctions.insertIntoDetailsTable(FILE_DATA);

    } else {
        res.status(400).json("file data not received");
    }
    // extract name of the file from the file data and split it by _ and store in array
    // const fileName = FILE_DATA.properties?.name.split("_");
    // console.log(fileName);
};


module.exports = {
    handleFileData,
    FILE_DATA
};


