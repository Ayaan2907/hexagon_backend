const express = require("express");
const router = express.Router();

const tableData = require("../Controllers/tableData");

router.get("/", tableData.getSingleTableRecordController);

module.exports = router;
