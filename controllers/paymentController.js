const Order = require("../models/orderModel");
const receiptQueue = require("../queues/receiptQueue"); 

exports.simulatePayment = async (req, res) => {
  try {
    const {
      orderId,
      customerName,
      customerEmail,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
    } = req.body;

    if (!orderId || !customerEmail || !total) {
      return res.status(400).json({
        message: "orderId, customerEmail, and total are required",
      });
    }

    const existingOrder = await Order.findOne({ orderId });
    if (existingOrder) {
      return res.status(400).json({
        message: "Order with this orderId already exists",
      });
    }

    const order = new Order({
      orderId,
      customerName,
      customerEmail,
      items,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod,
      orderDate: new Date(),
    });

    await order.save();

    //  BACKGROUND RECEIPT GENERATION 
    await receiptQueue.add("generate-receipt", {
      orderId: order.orderId,
      customerEmail: order.customerEmail,
    });

    res.status(201).json({
      message: "Payment simulated successfully",
      orderId: order.orderId,
    });
  } catch (error) {
    console.error("Payment simulation error:", error);
    res.status(500).json({
      message: "Failed to simulate payment",
    });
  }
};
