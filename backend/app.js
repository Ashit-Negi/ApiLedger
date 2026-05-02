require("dotenv").config();
require("./cron/billingCron");

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
const gatewayRoutes = require("./routes/gatewayRoutes");
const usageRoutes = require("./routes/usageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// 🔥 FIXED CORS CONFIG
app.use(
  cors({
    origin: ["http://localhost:5173", "https://api-ledger.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());

connectDB();

// 🔗 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/apis", apiRoutes);
app.use("/gateway", gatewayRoutes);
app.use("/api/usage", usageRoutes);
app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("ApiLedger API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
