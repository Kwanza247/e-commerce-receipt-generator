const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");

const receiptQueue = new Queue("receipt-queue", {
  connection: redisConnection,
});

module.exports = receiptQueue;
