const crypto = require("crypto");

const generateApiKey = () => {
  // 🔐 32 bytes random → hex string (64 chars)
  const random = crypto.randomBytes(32).toString("hex");

  // optional prefix (branding + identification)
  return `mf_${random}`;
};

module.exports = generateApiKey;
