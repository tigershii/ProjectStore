const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { cacheCart, getCachedCart } = require('../redis/cart');

router.get('/', authenticateToken, async(req, res) => {
    const userId = req.user.userId;
    const cachedCart = await getCachedCart(userId);
    if (cachedCart) {
        console.log(cachedCart);
        return res.status(200).json(cachedCart);
    }
    res.status(200).json({ items: [] });
});

module.exports = router;