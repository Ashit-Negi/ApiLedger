const cron = require("node-cron");
const Invoice = require("../models/invoiceModel");
const UsageLog = require("../models/usageLogModel");
const ApiKey = require("../models/apiKeyModel");

// 🔥 helper
const getUserApiKeys = async (userId) => {
  const keys = await ApiKey.find().populate({
    path: "apiId",
    match: { userId },
  });

  return keys.filter((k) => k.apiId !== null).map((k) => k._id);
};

// 🔥 run every 1st day of month at 2 AM
cron.schedule("0 2 1 * *", async () => {
  console.log("🔄 Running monthly billing...");

  try {
    const users = await Invoice.distinct("userId"); // simple hack

    for (let userId of users) {
      const validKeys = await getUserApiKeys(userId);

      const logs = await UsageLog.find({
        apiKey: { $in: validKeys },
        billed: false,
      });

      const totalRequests = logs.length;

      if (totalRequests === 0) continue;

      const amount = totalRequests * 0.01;

      if (amount < 50) continue; // 🔥 threshold

      await Invoice.create({
        userId,
        totalRequests,
        amount,
      });

      console.log(`Invoice created for user ${userId}`);
    }
  } catch (err) {
    console.error("CRON ERROR:", err.message);
  }
});
