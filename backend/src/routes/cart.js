const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { cacheCart, getCachedCart } = require('../redis/cart');
const { getCachedItem } = require('../redis/items');
const Items = require('../models/items');

router.get('/', authenticateToken, async(req, res) => {
    try {
        const userId = req.user.userId;
        const cachedCart = await getCachedCart(userId);
        const itemPromises = cachedCart.items.map(async (itemId) => {
            const cachedItem = await getCachedItem(itemId);
            if (cachedItem) {
                return cachedItem;
            }
            return await Items.findOne({ where: { id: itemId } });
        });
        const items = await Promise.all(itemPromises);
        const validItems = items.filter(Boolean);
        const totalPrice = validItems.reduce((sum, item) => sum + item.price, 0);
        const quantity = validItems.length;
        res.status(200).json({ items: validItems, totalPrice, quantity });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});

router.post('/', authenticateToken, async(req, res) => {
    try {
        const userId = req.user.userId;
        const newId = req.body.itemId;
        const cart = await getCachedCart(userId);
        if (cart.items.includes(newId)) {
            return res.status(400).json({ message: 'Item already in cart' });
        }
        const cachedItem = await getCachedItem(newId);
        if (!cachedItem) {
            const item = await Items.findOne({ where: { id: newId } });
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            await cacheItem(newId, item);
        }
        if (cachedItem.sellerId === userId) {
            return res.status(400).json({ message: 'Cannot add own item to cart' });
        }
        cart.items.push(newId);
        await cacheCart(userId, cart);
        res.status(201).json({ message: 'Cart saved successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to save cart' });
    }
});

router.delete('/', authenticateToken, async(req, res) => {
    try {
        const itemId = parseInt(req.query.itemId);
        const userId = req.user.userId;
        
        const cachedCart = await getCachedCart(userId);
        
        if (!cachedCart || !cachedCart.items) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        const newItems = cachedCart.items.filter(id => {
            return Number(id) !== itemId;
        });
        
        await cacheCart(userId, { items: newItems });

        const itemPromises = newItems.map(async (itemId) => {
            const cachedItem = await getCachedItem(itemId);
            if (cachedItem) {
                return cachedItem;
            }
            return await Items.findOne({ where: { id: itemId } });
        });

        const items = await Promise.all(itemPromises);
        const validItems = items.filter(Boolean);
        const totalPrice = validItems.reduce((sum, item) => sum + item.price, 0);
        const quantity = validItems.length;

            
        res.status(200).json({ message: 'Item removed from cart', items: validItems, totalPrice, quantity });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Failed to remove item from cart' });
    }
});

module.exports = router;