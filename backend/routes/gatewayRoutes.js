const express = require("express");
const router = express.Router();

const apiKeyMiddleware = require("../middleware/apiKeyMiddleware");
const rateLimitMiddleware = require("../middleware/rateLimitMiddleware");
const loggerMiddleware = require("../middleware/loggerMiddleware");
const proxyRequest = require("../services/proxyService");
const planLimitMiddleware = require("../middleware/planLimitMiddleware");

// 🔥 Correct flow: validate → limit → log → proxy
router.use(
  "/:apiId",
  apiKeyMiddleware,
  loggerMiddleware,
  rateLimitMiddleware,
  planLimitMiddleware,

  proxyRequest,
);

module.exports = router;
