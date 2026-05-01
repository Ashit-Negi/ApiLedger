const Api = require("../models/apiModel");
const ApiKey = require("../models/apiKeyModel");
const generateApiKey = require("../utils/generateApiKey");

// Create API
exports.createApi = async (req, res) => {
  try {
    const { name, baseUrl } = req.body;

    const api = await Api.create({
      name,
      baseUrl,
      userId: req.user.id, // from auth middleware (we'll add soon)
    });

    res.status(201).json(api);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate API Key
exports.generateKey = async (req, res) => {
  try {
    const { apiId } = req.body;

    const key = generateApiKey();

    const apiKey = await ApiKey.create({
      apiId,
      key,
    });

    res.status(201).json(apiKey);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
