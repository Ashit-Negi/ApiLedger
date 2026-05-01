const Api = require("../models/apiModel"); // ✅ correct model
const ApiKey = require("../models/apiKeyModel");
const generateApiKey = require("../utils/generateApiKey");

// 🔥 Create API
exports.createApi = async (req, res) => {
  try {
    const { name, baseUrl } = req.body;

    if (!name || !baseUrl) {
      return res.status(400).json({ message: "All fields required" });
    }

    const api = await Api.create({
      name,
      baseUrl,
      userId: req.user._id, // ✅ fix
    });

    res.status(201).json({
      success: true,
      data: api,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 🔥 Get APIs
exports.getApis = async (req, res) => {
  try {
    const apis = await Api.find({ userId: req.user._id });

    res.json({
      success: true,
      data: apis,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔑 Generate API Key
exports.generateKey = async (req, res) => {
  try {
    const { apiId } = req.body;

    if (!apiId) {
      return res.status(400).json({ message: "apiId required" });
    }

    const api = await Api.findById(apiId);

    if (!api) {
      return res.status(404).json({ message: "API not found" });
    }

    if (api.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // 🔐 unique key
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
    console.error("API KEY ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
};
