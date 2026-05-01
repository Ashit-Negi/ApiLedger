const ApiKey = require("../models/apiKeyModel");
const Api = require("../models/apiModel");

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return res.status(401).json({ message: "API key required" });
    }

    // 🔍 Find API Key + attach API
    const apiKey = await ApiKey.findOne({
      key,
      status: "active",
    }).populate("apiId");

    if (!apiKey) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    // 🔒 Check API active
    if (!apiKey.apiId || !apiKey.apiId.isActive) {
      return res.status(403).json({ message: "API is inactive" });
    }

    // 📊 Update usage (lightweight tracking)
    apiKey.usageCount += 1;
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    // attach for next middleware (proxy, logger, billing)
    req.apiKey = apiKey;
    req.api = apiKey.apiId;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = apiKeyMiddleware;
