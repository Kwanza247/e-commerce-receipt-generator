const express = require("express");
const { simulatePayment } = require("../controllers/paymentController");

const router = express.Router();

/**
 * @swagger
 * /api/payments/simulate:
 *   post:
 *     summary: Simulate a payment and create an order
 *     description: Creates a new order and sends it to background queue for receipt generation
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - customerEmail
 *               - total
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: ORD123
 *               customerName:
 *                 type: string
 *                 example: John Doe
 *               customerEmail:
 *                 type: string
 *                 example: john@example.com
 *               items:
 *                 type: array
 *               subtotal:
 *                 type: number
 *                 example: 1000
 *               tax:
 *                 type: number
 *                 example: 100
 *               discount:
 *                 type: number
 *                 example: 50
 *               total:
 *                 type: number
 *                 example: 1050
 *               paymentMethod:
 *                 type: string
 *                 example: card
 *     responses:
 *       201:
 *         description: Payment simulated successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */
router.post("/simulate", simulatePayment);

module.exports = router;
