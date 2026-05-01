const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoutes);
app.use("/api/apis", apiRoutes);
app.get("/", (req, res) => {
  res.send("ApiLedger API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
