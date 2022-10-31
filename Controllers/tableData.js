// responsible to get all the records of provided table name

const tableRecord = require('../Models/getTableData');
 
const getSingleTableRecordController = async (req, res) => {
    const tableName = req.query.tableName;
    console.log(tableName);
    try {
        const result = await tableRecord.getSingleTableRecord(tableName);
        res.status(200).json(result);
        console.log(result);
    }catch(err){
        res.status(400).json(err);
        console.log(err);
    }
}

module.exports = {
    getSingleTableRecordController
}

