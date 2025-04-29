const { createClient } = require('redis');

let redisClient;

async function connectRedis() {
  try {
    redisClient = createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    });

    redisClient.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    await redisClient.connect();
    console.log('Connected to Redis successfully');
    return redisClient;
  } catch (error) {
    console.error('Redis connection failed:', error);
    throw error;
  }
}

async function getRedisClient() {
  if (!redisClient || !redisClient.isReady) {
    await connectRedis();
  }
  return redisClient;
}

module.exports = {
  connectRedis,
  getRedisClient,
};