const mongoose = require("mongoose");

const billingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
      index: true,
    },
    totalRequests: {
      type: Number,
      default: 0,
    },
    amount: {
      type: Number,
      default: 0,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    billingPeriod: {
      type: String, // e.g. "2026-05"
      index: true,
    },
  },
  { timestamps: true },
);

// 🔥 fast lookup
billingSchema.index({ userId: 1, billingPeriod: 1 });

module.exports = mongoose.model("Billing", billingSchema);
