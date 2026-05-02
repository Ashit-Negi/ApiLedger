const mongoose = require("mongoose");

const usageLogSchema = new mongoose.Schema(
  {
    apiKey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
    },
    endpoint: String,
    status: Number,
    latency: Number,

    // 🔥 NEW FIELD (IMPORTANT)
    billed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("UsageLog", usageLogSchema);
