const UsageLog = require("../models/usageLogModel");
const ApiKey = require("../models/apiKeyModel");
const Api = require("../models/apiModel");

const PRICE_PER_REQUEST = 1.0;

// 🔥 COMMON FUNCTION
const getUserApiKeys = async (userId) => {
  const keys = await ApiKey.find().populate({
    path: "apiId",
    match: { userId },
  });

  return keys.filter((k) => k.apiId !== null).map((k) => k._id);
};

// 🔥 GET LOGS
exports.getUsageLogs = async (req, res) => {
  try {
    const validKeys = await getUserApiKeys(req.user._id);

    const logs = await UsageLog.find({
      apiKey: { $in: validKeys },
    })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 🔥 GET STATS (UPDATED)
exports.getStats = async (req, res) => {
  try {
    const validKeys = await getUserApiKeys(req.user._id);

    const logs = await UsageLog.find({
      apiKey: { $in: validKeys },
    });

    const total = logs.length;
    const success = logs.filter((l) => l.status === 200).length;
    const failed = total - success;

    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    const avgLatency =
      total > 0
        ? Math.round(logs.reduce((acc, curr) => acc + curr.latency, 0) / total)
        : 0;

    res.json({
      success: true,
      data: {
        total,
        success,
        failed,
        successRate,
        avgLatency,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 HOURLY GRAPH
exports.getAnalyticsGraph = async (req, res) => {
  try {
    const validKeys = await getUserApiKeys(req.user._id);

    const logs = await UsageLog.find({
      apiKey: { $in: validKeys },
    });

    const map = {};

    logs.forEach((log) => {
      const hour = new Date(log.createdAt).getHours();

      if (!map[hour]) {
        map[hour] = {
          hour,
          requests: 0,
          success: 0,
          failed: 0,
        };
      }

      map[hour].requests += 1;

      if (log.status === 200) map[hour].success += 1;
      else map[hour].failed += 1;
    });

    const data = Object.values(map).sort((a, b) => a.hour - b.hour);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 REVENUE
exports.getRevenue = async (req, res) => {
  try {
    const validKeys = await getUserApiKeys(req.user._id);

    const totalRequests = await UsageLog.countDocuments({
      apiKey: { $in: validKeys },
    });

    const revenue = totalRequests * PRICE_PER_REQUEST;

    res.json({
      success: true,
      data: {
        totalRequests,
        revenue,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 API-WISE STATS (OPTIMIZED)
exports.getApiWiseStats = async (req, res) => {
  try {
    const apis = await Api.find({ userId: req.user._id });

    const result = [];

    for (let api of apis) {
      const keys = await ApiKey.find({ apiId: api._id });
      const keyIds = keys.map((k) => k._id);

      const logs = await UsageLog.find({
        apiKey: { $in: keyIds },
      });

      const total = logs.length;
      const success = logs.filter((l) => l.status === 200).length;
      const failed = total - success;
      const revenue = total * PRICE_PER_REQUEST;

      result.push({
        apiName: api.name,
        total,
        success,
        failed,
        revenue,
      });
    }

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 MONTHLY ANALYTICS
exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const validKeys = await getUserApiKeys(req.user._id);

    const logs = await UsageLog.find({
      apiKey: { $in: validKeys },
    });

    const map = {};

    logs.forEach((log) => {
      const date = new Date(log.createdAt).toISOString().split("T")[0];

      if (!map[date]) {
        map[date] = {
          date,
          requests: 0,
          revenue: 0,
        };
      }

      map[date].requests += 1;
      map[date].revenue += PRICE_PER_REQUEST;
    });

    const data = Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
