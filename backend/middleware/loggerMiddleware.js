const UsageLog = require("../models/usageLogModel");
const updateBilling = require("../services/billingService");

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const latency = Date.now() - start;

    // fire-and-forget (no await)
    updateBilling(req.apiKey._id).catch(console.error);

    UsageLog.create({
      apiKey: req.apiKey._id,
      endpoint: req.originalUrl,
      status: res.statusCode,
      latency,
    }).catch(console.error);
  });

  next();
};

module.exports = loggerMiddleware;
