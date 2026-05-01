const express = require("express");
const router = express.Router();

const { createApi, generateKey } = require("../controllers/apiController");

router.post("/create", createApi);
router.post("/generate-key", generateKey);

module.exports = router;
