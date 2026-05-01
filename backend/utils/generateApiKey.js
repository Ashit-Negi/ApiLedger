const crypto = require("crypto");

const generateApiKey = () => {
  return "mf_" + crypto.randomBytes(16).toString("hex");
};

module.exports = generateApiKey;
