const insertFileData = require('../Models/insertNewData');
let FILE_DATA = {};

const handleFileData = (req, res, db) => {
    if (req.body){
        FILE_DATA = req.body;
        console.log(FILE_DATA);
        res.status(200).json("file data received");
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


