const { createClient } = require('redis');

let redisClient;

async function connectRedis() {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
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