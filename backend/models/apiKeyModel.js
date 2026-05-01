const mongoose = require("mongoose");

const apiKeySchema = new mongoose.Schema(
  {
    apiId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Api",
      required: true,
      index: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "revoked"],
      default: "active",
      index: true,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// 🔥 Fast lookup for gateway
apiKeySchema.index({ key: 1, status: 1 });

module.exports = mongoose.model("ApiKey", apiKeySchema);
