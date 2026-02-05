const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const Order = require("../models/orderModel");
const Receipt = require("../models/receiptModel");
const { generateReceipt } = require("../services/receiptGenerator");
const { sendReceiptEmail } = require("../services/emailService");
require("dotenv").config();

// Worker for processing receipt jobs
const receiptWorker = new Worker(
  "receipt-queue",
  async (job) => {
    try {
      const { orderId, customerEmail } = job.data;

      //  Fetch order from DB
      const order = await Order.findOne({ orderId });
      if (!order) throw new Error(`Order not found: ${orderId}`);

      //  Idempotency: check if receipt already exists
      let receipt = await Receipt.findOne({ orderId });
      if (receipt) {
        console.log(`Receipt already exists for order ${orderId}`);
        return receipt.receiptUrl;
      }

      
      const { pdfBuffer, cloudinaryUrl, publicId } = await generateReceipt(order);

      
      receipt = new Receipt({
        receiptId: `R-${order.orderId}`,
        orderId: order.orderId,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        paymentMethod: order.paymentMethod,
        orderDate: order.orderDate,
        receiptUrl: cloudinaryUrl,
        receiptPublicId: publicId,
      });
      await receipt.save();

      
      await sendReceiptEmail(customerEmail, cloudinaryUrl);

      console.log(`Receipt generated and emailed for order ${orderId}`);
      return cloudinaryUrl;
    } catch (err) {
      console.error(`Failed to process job ${job.id}:`, err);
      throw err; // Allow BullMQ to retry if configured
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // how many jobs to process at the same time
  }
);

receiptWorker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err.message);
});

receiptWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed successfully.`);
});

module.exports = receiptWorker;
