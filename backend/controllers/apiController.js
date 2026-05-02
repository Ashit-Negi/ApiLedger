const Api = require("../models/apiModel");
const ApiKey = require("../models/apiKeyModel");
const UsageLog = require("../models/usageLogModel");
const generateApiKey = require("../utils/generateApiKey");

const PRICE_PER_REQUEST = 0.01;

// 🔥 CREATE API
exports.createApi = async (req, res) => {
  try {
    const { name, baseUrl } = req.body;

    if (!name || !baseUrl) {
      return res.status(400).json({
        success: false,
        message: "Name and baseUrl are required",
      });
    }

    const api = await Api.create({
      name: name.trim(),
      baseUrl: baseUrl.trim(),
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: api,
    });
  } catch (error) {
    console.error("CREATE API ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create API",
    });
  }
};

// 🔥 GET ALL APIs
exports.getApis = async (req, res) => {
  try {
    const apis = await Api.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: apis,
    });
  } catch (error) {
    console.error("GET APIS ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch APIs",
    });
  }
};

// 🔑 GENERATE API KEY
exports.generateKey = async (req, res) => {
  try {
    const { apiId } = req.body;

    if (!apiId) {
      return res.status(400).json({
        success: false,
        message: "apiId is required",
      });
    }

    const api = await Api.findById(apiId);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    if (api.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let key;
    let exists = true;

    while (exists) {
      key = generateApiKey();
      exists = await ApiKey.findOne({ key });
    }

    const apiKey = await ApiKey.create({
      apiId,
      key,
      status: "active",
    });

    res.status(201).json({
      success: true,
      data: apiKey,
    });
  } catch (error) {
    console.error("GENERATE KEY ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to generate API key",
    });
  }
};

// 🔥 GET API DETAILS (VERY IMPORTANT)
exports.getApiDetails = async (req, res) => {
  try {
    const { apiId } = req.params;

    const api = await Api.findById(apiId);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    // 🔒 ownership check
    if (api.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const keys = await ApiKey.find({ apiId });
    const keyIds = keys.map((k) => k._id);

    const logs = await UsageLog.find({
      apiKey: { $in: keyIds },
    }).sort({ createdAt: -1 });

    const total = logs.length;
    const success = logs.filter((l) => l.status === 200).length;
    const failed = total - success;

    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    const revenue = total * PRICE_PER_REQUEST;

    // 🔥 graph
    const map = {};
    logs.forEach((log) => {
      const hour = new Date(log.createdAt).getHours();

      if (!map[hour]) {
        map[hour] = { hour, requests: 0 };
      }

      map[hour].requests += 1;
    });

    const graph = Object.values(map).sort((a, b) => a.hour - b.hour);

    res.json({
      success: true,
      data: {
        api,
        keys,
        stats: {
          total,
          success,
          failed,
          successRate,
          revenue,
        },
        graph,
        logs: logs.slice(0, 20), // 🔥 limit
      },
    });
  } catch (error) {
    console.error("API DETAILS ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch API details",
    });
  }
};

// 🗑 DELETE API
exports.deleteApi = async (req, res) => {
  try {
    const { apiId } = req.params;

    const api = await Api.findById(apiId);

    if (!api) {
      return res.status(404).json({
        success: false,
        message: "API not found",
      });
    }

    if (api.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const keys = await ApiKey.find({ apiId });
    const keyIds = keys.map((k) => k._id);

    await UsageLog.deleteMany({ apiKey: { $in: keyIds } });
    await ApiKey.deleteMany({ apiId });
    await Api.deleteOne({ _id: apiId });

    res.json({
      success: true,
      message: "API deleted successfully",
    });
  } catch (error) {
    console.error("DELETE API ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete API",
    });
  }
};

exports.revokeKey = async (req, res) => {
  try {
    const { keyId } = req.params;

    const key = await ApiKey.findById(keyId).populate("apiId");

    if (!key) {
      return res.status(404).json({
        success: false,
        message: "Key not found",
      });
    }

    if (!key.apiId) {
      return res.status(400).json({
        success: false,
        message: "Invalid key mapping",
      });
    }

    // 🔒 ownership check
    if (key.apiId.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // 🔥 already revoked check
    if (key.status === "revoked") {
      return res.status(400).json({
        success: false,
        message: "API key already revoked",
      });
    }

    key.status = "revoked";
    await key.save();

    res.json({
      success: true,
      message: "API key revoked successfully",
      data: key,
    });
  } catch (err) {
    console.error("REVOKE ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to revoke key",
    });
  }
};

exports.getApiCount = async (req, res) => {
  try {
    const count = await Api.countDocuments({
      userId: req.user._id,
    });

    res.json({
      success: true,
      data: count,
    });
  } catch (error) {
    console.error("API COUNT ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to get API count",
    });
  }
};
