const { Queue } = require("bullmq");
const redisConnection = require("../config/redis");


const receiptQueue = new Queue("receiptQueue", {
  connection: redisConnection, 
  defaultJobOptions: {
    removeOnComplete: true, // automatically clean up completed jobs
    removeOnFail: false,
    attempts: 3, // retry failed jobs up to 3 times
  },
});

module.exports = receiptQueue;
