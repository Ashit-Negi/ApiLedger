const ApiKey = require("../models/apiKeyModel");

const apiKeyMiddleware = async (req, res, next) => {
  try {
    const key = req.headers["x-api-key"];

    if (!key) {
      return res.status(401).json({ message: "API key required" });
    }

    const apiKey = await ApiKey.findOne({ key, status: "active" });

    if (!apiKey) {
      return res.status(403).json({ message: "Invalid API key" });
    }

    req.apiKey = apiKey;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = apiKeyMiddleware;
