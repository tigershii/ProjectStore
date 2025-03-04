const { getRedisClient, connectRedis } = require('./client');

const CART_PREFIX = 'cart:'
const CART_TTL = 60*60*24*7;

async function cacheCart(userId, cart) {
  const client = await getRedisClient();
  await client.set(`${CART_PREFIX}${userId}`, JSON.stringify(cart), {
    EX: CART_TTL
  });
}

async function getCachedCart(userId) {
  const client = await getRedisClient();
  const cart = await client.get(`${CART_PREFIX}${userId}`);
  return cart ? JSON.parse(cart) : null;
}

