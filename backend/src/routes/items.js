const express = require('express');
const router = express.Router();
const { generatePresignedUrl, deleteFromS3 } = require('../utils/s3');
const authenticateToken = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Items = require('../models/items')
const { cacheItem, getCachedItem, cachePopularItems, getCachedPopularItems, invalidateItemCache } = require('../redis/items');

router.get('/', async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const category = req.query.category;
        const limit = 16;
        const offset = (page - 1) * limit;

        if (page === 1 && !category) {
            const cachedItems = await getCachedPopularItems();
            if (cachedItems) {
                console.log('Retrieved popular items from cache');
                return res.status(200).json(cachedItems);
            }
        }
        
        const result = await Items.findAndCountAll({
            where: category ? { category: category } : {},
            limit: limit,
            offset: offset,
            order: [
                ['views', 'DESC'], 
                ['name', 'ASC'] 
            ]
        });
        
        const totalItems = result.count;
        const totalPages = Math.ceil(totalItems / limit);

        const response = {
            items: result.rows,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalItems,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }

        if (page === 1 && !category) {
            await cachePopularItems(response);
        }
        
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch items'});
    }
});

router.post('/', authenticateToken, async(req, res) => {
    try {   
        const { name, price, description, category, images } = req.body;
        const userId = req.user.userId;
        const newItem = {
            name: name,
            price: price,
            description: description,
            category: category,
            images: images,
            sellerId: userId,
            available: true
        }
        console.log(newItem);
        await Items.create(newItem);
        await cacheItem(newItem.id, newItem);
        res.status(201).json({ message: 'Item created successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Item creation failed' })
    }
});

router.get('/user/:userId?', async(req, res) => {
    try {
        let userId = req.params.userId;

        if (userId == -1) {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.userId;
        }
        const items = await Items.findAll({ where: { sellerId: userId }, order: [['name', 'ASC']] });
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

router.get('/:itemId', async(req, res) => {
    try {
        const itemId = req.params.itemId;

        const cachedItem = await getCachedItem(itemId);
        if (cachedItem) {
            console.log('Retrieved item from cache');
            Items.increment('views', { where: { id: itemId } });
            return res.status(200).json(cachedItem);
        }

        const item = await Items.findOne({ where: { id: itemId } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        Items.increment('views', { where: { id: itemId } });
        await cacheItem(itemId, item);
        res.status(200).json(item);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch item' });
    }
});

router.delete('/:itemId', authenticateToken, async(req, res) => {
    try {
        const itemId = req.params.itemId;
        const userId = req.user.userId;
        const item = await Items.findOne({ where: { id: itemId } });
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        if (item.sellerId !== userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        if (item.images.length > 0) {
            let imageKeys = item.images.map(url => {
                const key = url.split('.com/')[1];
                return { Key: key };
            });
            deleteFromS3(imageKeys);
        }
        
        await Items.destroy({ where: { id: itemId } });
        await invalidateItemCache(itemId);
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete item' });
    }
});

router.post('/presignedURL', async (req, res) => {
    console.log('Generating presigned URLs');
    try {
        const { fileCount, fileTypes } = req.body;

        if (!fileCount || !fileTypes || !Array.isArray(fileTypes) || fileTypes.length !== fileCount) {
            return res.status(400).json({ error: 'Invalid request parameters' });
        }

        const urls = []
        const s3Urls = []

        for (let i = 0; i < fileCount; i++) {
            const fileType = fileTypes[i];
            const fileExtension = fileType.split('/')[1] || 'jpg';
            const fileName = `${uuidv4()}.${fileExtension}`;
            const key = `items/${fileName}`;
            const presignedURL = await generatePresignedUrl(key, fileType);
            urls.push(presignedURL);
            const s3Url = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
            s3Urls.push(s3Url);
        }
        console.log('Presigned URLs generated successfully');
        res.json({ urls, s3Urls });
    } catch (error) {
        console.error('Error generating presigned URLs:', error);
        res.status(500).json({ error: 'Error generating presigned URLs' });
    }
});

module.exports = router;