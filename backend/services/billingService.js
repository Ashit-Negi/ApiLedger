const Billing = require("../models/billingModel");

const updateBilling = async (apiKeyId) => {
  let billing = await Billing.findOne({ apiKey: apiKeyId });

  if (!billing) {
    billing = await Billing.create({ apiKey: apiKeyId });
  }

  billing.totalRequests += 1;

  // pricing: ₹0.5 per 100 requests
  billing.amount = (billing.totalRequests / 100) * 0.5;

  await billing.save();
};

module.exports = updateBilling;
