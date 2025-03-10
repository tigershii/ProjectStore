const { getRedisClient, connectRedis } = require('./client');

const POPULAR_ITEMS_CACHE_KEY = 'popular_items';
const CACHE_TTL = 60 * 10;
const ITEM_CACHE_PREFIX = 'item:';
const ITEM_TTL = 60 * 30;

async function cacheItem(itemId, itemData) {
  const client = await getRedisClient();
  await client.set(`${ITEM_CACHE_PREFIX}${itemId}`, JSON.stringify(itemData), {
    EX: ITEM_TTL
  });
}

async function getCachedItem(itemId) {
  const client = await getRedisClient();
  const item = await client.get(`${ITEM_CACHE_PREFIX}${itemId}`);
  return item ? JSON.parse(item) : null;
}

async function cachePopularItems(items) {
  const client = await getRedisClient();
  await client.set(POPULAR_ITEMS_CACHE_KEY, JSON.stringify(items), {
    EX: CACHE_TTL
  });
}

async function getCachedPopularItems() {
  const client = await getRedisClient();
  const items = await client.get(POPULAR_ITEMS_CACHE_KEY);
  return items ? JSON.parse(items) : null;
}

async function invalidateItemCache(itemId) {
  const client = await getRedisClient();
  await client.del(`${ITEM_CACHE_PREFIX}${itemId}`);
  await client.del(POPULAR_ITEMS_CACHE_KEY);
}

async function invalidatePopularItemsCache() {
  const client = await getRedisClient();
  await client.del(POPULAR_ITEMS_CACHE_KEY);
}

module.exports = {
  connectRedis,
  getRedisClient,
  cacheItem,
  getCachedItem,
  cachePopularItems,
  getCachedPopularItems,
  invalidateItemCache,
  invalidatePopularItemsCache
};