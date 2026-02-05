const IORedis = require("ioredis");

let redisConnection;

if (process.env.UPSTASH_REDIS_URL) {
  
  redisConnection = new IORedis(process.env.UPSTASH_REDIS_URL, {
    tls: {}, 
    maxRetriesPerRequest: null, 
  });
} else {
  // Local Redis fallback (development only)
  redisConnection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: null,
  });
}

module.exports = redisConnection;
