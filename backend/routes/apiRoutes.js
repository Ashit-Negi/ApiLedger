const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  createApi,
  generateKey,
  getApis,
} = require("../controllers/apiController");

// 🔒 Protected routes
router.post("/create", authMiddleware, createApi);
router.post("/generate-key", authMiddleware, generateKey);
router.get("/", authMiddleware, getApis);
module.exports = router;
