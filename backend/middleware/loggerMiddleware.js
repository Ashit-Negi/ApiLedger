const UsageLog = require("../models/usageLogModel");
const updateBilling = require("../services/billingService");

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const latency = Date.now() - start;

      const logData = {
        apiKey: req.apiKey._id,
        apiId: req.api?._id,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        latency,
        timestamp: new Date(),
      };

      // 🔥 Fire & forget
      UsageLog.create(logData).catch(console.error);

      // 💰 Billing update
      updateBilling(req.apiKey._id).catch(console.error);
    } catch (err) {
      console.error("Logger error:", err.message);
    }
  });

  next();
};

module.exports = loggerMiddleware;
