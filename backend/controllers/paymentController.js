const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PDFDocument = require("pdfkit");

const Invoice = require("../models/invoiceModel");
const UsageLog = require("../models/usageLogModel");
const ApiKey = require("../models/apiKeyModel");

// 🔥 helper
const getUserApiKeys = async (userId) => {
  const keys = await ApiKey.find().populate({
    path: "apiId",
    match: { userId },
  });

  return keys.filter((k) => k.apiId !== null).map((k) => k._id);
};

// 🔥 GENERATE INVOICE
exports.generateInvoice = async (req, res) => {
  try {
    const validKeys = await getUserApiKeys(req.user._id);

    const logs = await UsageLog.find({
      apiKey: { $in: validKeys },
      billed: false,
    });

    const totalRequests = logs.length;

    if (totalRequests === 0) {
      return res.json({
        success: false,
        message: "No new usage to bill",
      });
    }

    let billableRequests = totalRequests;
    let pricePerRequest = 0;

    // 🔥 PRICING LOGIC
    if (req.user.isPro) {
      pricePerRequest = 0.005;
    } else {
      const FREE_LIMIT = 1000;

      if (totalRequests <= FREE_LIMIT) {
        return res.json({
          success: false,
          message: `Free tier: ${totalRequests}/${FREE_LIMIT} used`,
        });
      }

      billableRequests = totalRequests - FREE_LIMIT;
      pricePerRequest = 1.0;
    }

    const amount = billableRequests * pricePerRequest;

    const invoice = await Invoice.create({
      userId: req.user._id,
      totalRequests: billableRequests,
      amount,
    });

    res.json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 CREATE CHECKOUT SESSION
exports.checkoutInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (invoice.status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    // 🔥 STRIPE MINIMUM FIX
    const MIN_AMOUNT = 50;

    const finalAmount =
      invoice.amount < MIN_AMOUNT ? MIN_AMOUNT : invoice.amount;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "API Usage Invoice",
            },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    invoice.sessionId = session.id;
    await invoice.save();

    res.json({ url: session.url });
  } catch (err) {
    console.error("CHECKOUT ERROR:", err.message);
    res.status(500).json({ message: "Payment failed" });
  }
};

// 🔥 VERIFY PAYMENT (MOST IMPORTANT FIX)
exports.verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const invoice = await Invoice.findOne({
      sessionId: session.id,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    if (session.payment_status === "paid") {
      // 🔥 mark invoice paid
      invoice.status = "paid";
      await invoice.save();

      // 🔥 get user's api keys
      const validKeys = await getUserApiKeys(invoice.userId);

      // 🔥 mark logs as billed
      await UsageLog.updateMany(
        {
          apiKey: { $in: validKeys },
          billed: false,
        },
        {
          $set: { billed: true },
        },
      );
    }

    res.json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 GET ALL INVOICES
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 DOWNLOAD INVOICE PDF
exports.downloadInvoice = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // 🔒 ownership check
    if (invoice.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const doc = new PDFDocument();

    // headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice-${invoice._id}.pdf`,
    );

    doc.pipe(res);

    // 🧾 PDF content
    doc.fontSize(20).text("APILEDGER Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Invoice ID: ${invoice._id}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc.text(`Total Requests: ${invoice.totalRequests}`);
    doc.text(`Amount: ₹ ${invoice.amount.toFixed(2)}`);
    doc.text(`Status: ${invoice.status}`);
    doc.moveDown();

    doc.text("Thank you for using APILEDGER");

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
