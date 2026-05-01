const mongoose = require("mongoose");

const apiSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    baseUrl: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    version: {
      type: String,
      default: "v1",
    },
  },
  { timestamps: true },
);

// 🔥 Fast queries
apiSchema.index({ userId: 1, name: 1 });

module.exports = mongoose.model("Api", apiSchema);
