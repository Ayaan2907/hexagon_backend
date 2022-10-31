const express = require("express");
const router = express.Router();

const fetch = require("./handleDataFetching");
const dataInput = require("./");

router.get("/", (req, res) => {
    res.status(200).json("Hello World");
});

router.use("/fetch", fetch);
router.use("/upload", dataInput);

module.exports = router;
