const mongoose = require("mongoose");

const receiptSchema = new mongoose.Schema(
  {
    receiptId: {
      type: String,
      required: true
    },
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    customerName: String,
    customerEmail: String,
    items: [{ name: String, quantity: Number, price: Number }],
    subtotal: Number,
    tax: Number,
    discount: Number,
    total: { type: Number, required: true },
    paymentMethod: String,
    orderDate: Date,

    receiptUrl: { type: String, required: true },
    receiptPublicId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Receipt", receiptSchema);
