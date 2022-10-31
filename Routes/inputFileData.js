const express = require("express");
const router = express.Router();
const { handleFileData } = require("../Controllers/fileData");

router.post("/", handleFileData);

module.exports = router;
