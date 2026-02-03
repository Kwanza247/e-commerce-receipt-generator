const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  customerName: String,
  customerEmail: String,
  items: [{ name: String, quantity: Number, price: Number }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  total: Number,
  paymentMethod: String,
  orderDate: Date,
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;