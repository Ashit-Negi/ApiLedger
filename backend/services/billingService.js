const Billing = require("../models/billingModel");
const ApiKey = require("../models/apiKeyModel");
const Api = require("../models/apiModel");
const User = require("../models/userModel");

const PRICING = {
  free: {
    limit: 1000,
    pricePer100: 0,
  },
  pro: {
    limit: 0,
    pricePer100: 0.5,
  },
};

const getBillingPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
};

const updateBilling = async (apiKeyId) => {
  try {
    const apiKey = await ApiKey.findById(apiKeyId).populate({
      path: "apiId",
      populate: { path: "userId" },
    });

    if (!apiKey) return;

    const user = apiKey.apiId.userId;
    const plan = user.plan || "free";

    const billingPeriod = getBillingPeriod();

    let billing = await Billing.findOne({
      userId: user._id,
      apiKeyId: apiKey._id,
      billingPeriod,
    });

    if (!billing) {
      billing = await Billing.create({
        userId: user._id,
        apiKeyId: apiKey._id,
        plan,
        billingPeriod,
      });
    }

    // 🔢 increment usage
    billing.totalRequests += 1;

    // 💰 pricing logic
    if (plan === "free") {
      billing.amount = 0;
    } else if (plan === "pro") {
      const price = PRICING.pro.pricePer100;
      billing.amount = Math.ceil(billing.totalRequests / 100) * price;
    }

    await billing.save();
  } catch (error) {
    console.error("Billing error:", error.message);
  }
};

module.exports = updateBilling;
