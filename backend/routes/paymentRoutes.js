const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { downloadInvoice } = require("../controllers/paymentController");

const {
  generateInvoice,
  checkoutInvoice,
  verifyPayment,
  getInvoices,
} = require("../controllers/paymentController");

router.use(authMiddleware);

router.post("/generate", generateInvoice);
router.post("/checkout", checkoutInvoice);
router.get("/verify", verifyPayment);
router.get("/invoices", getInvoices);
router.get("/invoice/:invoiceId/pdf", authMiddleware, downloadInvoice);
module.exports = router;
