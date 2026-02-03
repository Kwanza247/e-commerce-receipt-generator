const express = require("express");
const { generateAndSendReceipt, getReceiptByOrderId } = require("../controllers/receiptController");

const router = express.Router();

router.post("/generate-receipt", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }

  try {
    const receipt = await generateAndSendReceipt(orderId);

    res.json({
      message: "Receipt generated and emailed successfully",
      receiptUrl: receipt.receiptUrl,
    });
  } catch (err) {
    console.error("Receipt Route Error: ", err);
    res.status(500).json({ message: err.message || "Internal Server Error"});
  }
});

router.get("/:orderId", getReceiptByOrderId);

module.exports = router;
