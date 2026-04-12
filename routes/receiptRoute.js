const express = require("express");
const { generateAndSendReceipt, getReceiptByOrderId } = require("../controllers/receiptController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Receipts
 *   description: Receipt generation and retrieval APIs
 */

/**
 * @swagger
 * /api/receipts/generate-receipt:
 *   post:
 *     summary: Generate, store, and email a receipt
 *     description: |
 *       This endpoint generates a receipt from an order, uploads it to Cloudinary,
 *       stores it in the database, and emails it to the customer.
 *     tags: [Receipts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "ORD123456"
 *     responses:
 *       200:
 *         description: Receipt successfully generated and emailed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receiptId:
 *                   type: string
 *                   example: "R-ORD123456"
 *                 receiptUrl:
 *                   type: string
 *                   example: "https://cloudinary.com/receipt.pdf"
 *       400:
 *         description: Missing or invalid orderId
 *       500:
 *         description: Server error
 */
router.post("/generate-receipt", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }

  try {
    const receipt = await generateAndSendReceipt(orderId);

    res.json({
      receiptId: receipt.receiptId,
      receiptUrl: receipt.receiptUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

/**
 * @swagger
 * /api/receipts/{orderId}:
 *   get:
 *     summary: Get receipt by order ID
 *     description: Retrieves a receipt and generates a signed Cloudinary URL valid for 1 hour
 *     tags: [Receipts]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         example: "ORD123456"
 *     responses:
 *       200:
 *         description: Receipt retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 receiptId:
 *                   type: string
 *                 orderId:
 *                   type: string
 *                 customerEmail:
 *                   type: string
 *                 receiptUrl:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *       404:
 *         description: Receipt not found
 *       500:
 *         description: Server error
 */
router.get("/:orderId", getReceiptByOrderId);

module.exports = router;
