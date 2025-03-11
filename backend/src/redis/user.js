const { getRedisClient, connectRedis } = require('./client');

const USER_PREFIX = 'user:'
const USER_TTL = 60*60*24*7;

async function cacheUser(userId, username) {
    const client = await getRedisClient();
    await client.set(`${USER_PREFIX}${userId}`, username, {
        EX: USER_TTL
    });
}

async function getCachedUser(userId) {
    const client = await getRedisClient();
    const username = await client.get(`${USER_PREFIX}${userId}`);
    return username ? username : null;
}

module.exports = {
    cacheUser,
    getCachedUser
};