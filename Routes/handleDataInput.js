const express = require('express');
const router = express.Router();
const {handleFileData} = require('../Controllers/getFileData');

router.post('/upload', handleFileData);

module.exports = router;
