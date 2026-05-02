const UsageLog = require("../models/usageLogModel");

const PRICE_PER_REQUEST = 0.01; // 🔥 change later

const updateBilling = async (apiKeyId) => {
  try {
    const count = await UsageLog.countDocuments({
      apiKey: apiKeyId,
    });

    const revenue = count * PRICE_PER_REQUEST;

    console.log("💰 Revenue:", revenue);

    return revenue;
  } catch (error) {
    console.error("Billing error:", error.message);
  }
};

module.exports = updateBilling;
