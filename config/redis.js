const IORedis = require("ioredis");

const redisConnection = new IORedis(
  process.env.UPSTASH_REDIS_URL || {
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null, //as required bu bullmq v5
});

module.exports = redisConnection;
