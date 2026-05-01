const express = require("express");
const router = express.Router();

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware");
const loggerMiddleware = require("../middleware/loggerMiddleware");
const proxyRequest = require("../services/proxyService");

// 🔥 Correct flow: validate → limit → log → proxy
router.use(
  "/:apiId",
  apiKeyMiddleware,
  rateLimitMiddleware,
  loggerMiddleware,
  proxyRequest,
);

module.exports = router;
