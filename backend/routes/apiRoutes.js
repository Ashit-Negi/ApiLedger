const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createApi,
  generateKey,
  getApis,
  deleteApi,
  getApiDetails,
  revokeKey, // 🔥 ADD THIS
  getApiCount,
} = require("../controllers/apiController");

// 🔒 ALL ROUTES PROTECTED
router.use(authMiddleware);

// owner + admin ही create कर सकते हैं
router.post("/create", role("owner", "admin"), createApi);

// owner + admin ही key generate
router.post("/generate-key", role("owner", "admin"), generateKey);

// owner + admin ही revoke
router.patch("/revoke/:keyId", role("owner", "admin"), revokeKey);

// owner + admin ही delete
router.delete("/:apiId", role("owner", "admin"), deleteApi);

// read routes (owner/admin)
router.get("/", role("owner", "admin"), getApis);
router.get("/count", role("owner", "admin"), getApiCount);
router.get("/:apiId", role("owner", "admin"), getApiDetails);
module.exports = router;
