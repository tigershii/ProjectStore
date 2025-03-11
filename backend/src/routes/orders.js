const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { cacheCart, getCachedCart, clearCart } = require('../redis/cart');
const { getCachedItem, invalidateItemCache, invalidatePopularItemsCache } = require('../redis/items');
const Orders = require('../models/orders');
const Items = require('../models/items');
const OrderItems = require('../models/orderItems');
const sequelize = require('../db');

router.get('/', authenticateToken, async(req, res) => {
    const userId = req.user.userId;
    const orders = await Orders.findAll({
        where: { buyerId: userId }
    });
    res.status(200).json({ orders });
});

router.post('/', authenticateToken, async(req, res) => {
    const userId = req.user.userId;
    let cart = await getCachedCart(userId);
    
    if (!cart || cart.items.length === 0) {
        return res.status(400).json({
            error: true,
            message: 'Cannot create order with empty cart'
        });
    }
    
    const transaction = await sequelize.transaction();

    try {
        const itemPromises = cart.items.map(async (itemId) => {
            const cachedItem = await getCachedItem(itemId);
            if (cachedItem) {
                return cachedItem;
            }
            return await Items.findOne({ where: { id: itemId } });
        });

        const items = await Promise.all(itemPromises);
        const validItems = items.filter(Boolean);

        if (validItems.length === 0) {
            await transaction.rollback();
            return res.status(404).json({
                error: true,
                message: 'Cart items are not valid'
            });
        }

        const totalPrice = validItems.reduce((sum, item) => sum + item.price, 0);

        const order = await Orders.create({
            buyerId: userId,
            totalAmount: totalPrice,
            orderDate: new Date()
        }, { transaction });
        
        const orderItemsPromises = validItems.map(item => {
            return OrderItems.create({
                orderId: order.id,
                itemId: item.id,
                price: item.price
            }, { transaction });
        });

        await Promise.all(orderItemsPromises);

        const updateItemsPromises = validItems.map(item => {
            invalidateItemCache(item.id);
            return Items.update(
                {
                    available: false,
                    buyerId: userId
                },
                {
                    where: { id: item.id },
                    transaction
                }
            );
        });

        await Promise.all(updateItemsPromises);
        await transaction.commit();
        await clearCart(userId);
        await invalidatePopularItemsCache();
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order: {
                id: order.id,
                totalAmount: totalPrice,
                orderDate: order.orderDate,
                items: validItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price
                }))
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.log(error);
        res.status(500).json({
            error: true,
            message: 'Failed to create order'
        })
    }
    
});

module.exports = router;