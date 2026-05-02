const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getUsageLogs,
  getStats,
  getAnalyticsGraph,
  getRevenue,
  getApiWiseStats,
  getMonthlyAnalytics,
} = require("../controllers/usageController");

// 🔥 GET ALL LOGS
router.get("/", authMiddleware, getUsageLogs);

// 🔥 GET STATS
router.get("/stats", authMiddleware, getStats);

// 🔥 HOURLY GRAPH
router.get("/graph", authMiddleware, getAnalyticsGraph);

// 💰 REVENUE
router.get("/revenue", authMiddleware, getRevenue);

// 📊 API-WISE ANALYTICS
router.get("/api-wise", authMiddleware, getApiWiseStats);

// 📈 MONTHLY ANALYTICS
router.get("/monthly", authMiddleware, getMonthlyAnalytics);

module.exports = router;
