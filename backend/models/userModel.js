const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "owner", "consumer"],
      default: "owner",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
      index: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// 🔒 Hide sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
