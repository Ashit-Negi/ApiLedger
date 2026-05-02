const UsageLog = require("../models/usageLogModel");
const ApiKey = require("../models/apiKeyModel");
const Api = require("../models/apiModel");

const FREE_LIMIT = 100;

const planLimitMiddleware = async (req, res, next) => {
  try {
    const apiKeyId = req.apiKey._id;

    // 🔥 find api → user
    const apiKey = await ApiKey.findById(apiKeyId).populate({
      path: "apiId",
      populate: { path: "userId" },
    });

    const user = apiKey.apiId.userId;

    // 🔥 PRO users → skip
    if (user.isPro) {
      return next();
    }

    // 🔥 count today's requests
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const usageCount = await UsageLog.countDocuments({
      apiKey: apiKeyId,
      createdAt: { $gte: startOfDay },
    });

    // 🔥 limit check
    if (usageCount >= FREE_LIMIT) {
      return res.status(403).json({
        message: "Free plan limit reached (100/day). Upgrade to Pro 🚀",
      });
    }

    next();
  } catch (err) {
    console.error("PLAN LIMIT ERROR:", err.message);
    res.status(500).json({ message: "Limit check failed" });
  }
};

module.exports = planLimitMiddleware;
