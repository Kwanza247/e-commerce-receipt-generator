const { generateReceipt } = require("../services/receiptGenerator");
const Receipt = require("../models/receiptModel");
const Order = require("../models/orderModel");
const { sendReceiptEmail } = require("../services/emailService");
const cloudinary = require("../config/cloudinary")

exports.generateAndSendReceipt = async (orderId) => {
  try {

    //  IDEMPOTENCY CHECK
    const existingReceipt = await Receipt.findOne({ orderId });
    if (existingReceipt) {
      console.log(" Receipt already exists for order:", orderId);
      return existingReceipt;
    }

    //  Fetch order
    const order = await Order.findOne({ orderId });
    if (!order) throw new Error("Order not found");

    //  Generate PDF + upload to Cloudinary
    const {
      pdfBuffer,
      cloudinaryUrl,
      publicId,
    } = await generateReceipt(order);

    //  Save receipt record
    const receipt = new Receipt({
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

    //  Send PDF as attachment
    await sendReceiptEmail(receipt, pdfBuffer);

    console.log(" Receipt generated, emailed, and stored");

    return receipt;

  } catch (err) {
    console.error(" Error in generateAndSendReceipt:", err);
    throw err;
  }
};



exports.getReceiptByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params.id;

    const receipt = await Receipt.findOne({ orderId });
    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    // Generate a signed, time-limited URL ( expires in 1 hour)
    const signedUrl = cloudinary.url(receipt.receiptPublicId, {
      resource_type: "raw",
      type: "authenticated",
      sign_url: true,
      expires_at: Math.floor(Date.now() / 1000) +3600,
    });

    res.status(200).json({
      receiptId: receipt.receiptId,
      orderId: receipt.orderId,
      customerEmail: receipt.customerEmail,
      receiptUrl: signedUrl,
      createdAt: receipt.createdAt,
    });
  } catch (error) {
    console.error("Get Receipt Error:", error);
    res.status(500).json({ message: "Failed to fetch receipt" });
  }
};

