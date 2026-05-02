const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔐 AUTH ROUTES
router.post("/register", register);
router.post("/login", login);

// 🔥 GET CURRENT USER (VERY IMPORTANT)
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
