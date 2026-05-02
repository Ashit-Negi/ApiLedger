const ApiKey = require("../models/apiKeyModel");

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return res.status(401).json({ message: "API key required" });
    }

    // 🔍 find key
    const apiKey = await ApiKey.findOne({ key }).populate("apiId");

    if (!apiKey) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    // 🔥 check revoked
    if (apiKey.status !== "active") {
      return res.status(403).json({ message: "API key revoked" });
    }

    // 🔒 check API active
    if (!apiKey.apiId || !apiKey.apiId.isActive) {
      return res.status(403).json({ message: "API is inactive" });
    }

    // 📊 update usage safely
    apiKey.usageCount = (apiKey.usageCount || 0) + 1;
    apiKey.lastUsedAt = new Date();
    await apiKey.save();

    // attach
    req.apiKey = apiKey;
    req.api = apiKey.apiId;

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = apiKeyMiddleware;
