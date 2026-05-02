const UsageLog = require("../models/usageLogModel");
const updateBilling = require("../services/billingService");

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - start;

    const logData = {
      apiKey: req.apiKey._id,
      endpoint: req.originalUrl,
      method: req.method,
      status: res.statusCode,
      latency,
    };

    UsageLog.create(logData).catch(console.error);

    updateBilling(req.apiKey._id).catch(console.error);
  });

  next();
};

module.exports = loggerMiddleware;
