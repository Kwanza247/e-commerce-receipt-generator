const express = require("express");
const { simulatePayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/simulate", simulatePayment);

module.exports = router;
