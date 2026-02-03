const { Worker } = require("bullmq");
const redisConnection = require("../config/redis");
const Order = require("../models/orderModel");
const { generateReceipt } = require("../services/receiptGenerator");
const { sendReceiptEmail } = require("../services/emailService");
require('dotenv').config();  

new Worker(
  "receipt-queue",
  async (job) => {
    const { orderId, customerEmail } = job.data;

    const order = await Order.findOne({ orderId });
    if (!order) throw new Error("Order not found");

    const receiptUrl = await generateReceipt(order);
    await sendReceiptEmail(customerEmail, receiptUrl);
  },
  { connection: redisConnection }
);
