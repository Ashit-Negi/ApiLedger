const express = require("express");
const router = express.Router();

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const loggerMiddleware = require("../middleware/loggerMiddleware");
const proxyRequest = require("../services/proxyService");
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware");

// dynamic route
router.use(
  "/:apiId",
  apiKeyMiddleware,
  loggerMiddleware,
  proxyRequest,
  rateLimitMiddleware,
);

module.exports = router;
