const insertFunctions = require('./insertRecords');

const handleFileData = (req, res, db) => {
    if (req.body){
        let FILE_DATA = req.body;
        console.log(FILE_DATA);
        setTimeout(() => {
            // in order to avoid the delay in file acceptance, timeout is kept
        res.status(200).json("file data received");
        insertFunctions.insertIntoIndexingTables(FILE_DATA);
        // insertFunctions.insertIntoSubsetKeyTable(FILE_DATA);
        // insertFunctions.allInsertionOperations(FILE_DATA);
        }, 2000);

    } else {
        res.status(400).json("file data not received");
    }
};


module.exports = {
    handleFileData
};


