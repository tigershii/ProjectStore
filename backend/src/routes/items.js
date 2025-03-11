const express = require('express');
const router = express.Router();
const { generatePresignedUrl, deleteFromS3 } = require('../utils/s3');
const authenticateToken = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Items = require('../models/items');
const Users = require('../models/users');
const { cacheItem, getCachedItem, cachePopularItems, getCachedPopularItems, invalidateItemCache, invalidatePopularItemsCache } = require('../redis/items');
const { cacheUser, getCachedUser } = require('../redis/user');

router.get('/', async(req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const category = req.query.category;
        const search = req.query.search;
        const limit = 16;
        const offset = (page - 1) * limit;

        if (page === 1 && !category && !search) {
            const cachedItems = await getCachedPopularItems();
            if (cachedItems) {
                console.log('Retrieved popular items from cache');
                return res.status(200).json(cachedItems);
            }
        }
        let result;
        if (!search) {
            result = await Items.findAndCountAll({
                where: category ? { category: category, available: true } : { available: true },
                limit: limit,
                offset: offset,
                order: [
                    ['views', 'DESC'], 
                    ['name', 'ASC'] 
                ]
            });
        } else {
            const sequelize = require('../db');
            
            const sanitizedSearch = search.replace(/'/g, "''");
            
            const [rows, count] = await Promise.all([
                sequelize.query(`
                    SELECT * 
                    FROM items 
                    WHERE 
                        (
                        title ILIKE :searchPattern OR
                        description ILIKE :searchPattern OR
                        category ILIKE :searchPattern
                        )
                        AND available = true
                    ORDER BY 
                        (CASE WHEN title ILIKE :searchPattern THEN 3 ELSE 0 END) +
                        (CASE WHEN description ILIKE :searchPattern THEN 1 ELSE 0 END) +
                        (CASE WHEN category ILIKE :searchPattern THEN 2 ELSE 0 END) DESC,
                        views DESC,
                        title ASC
                    LIMIT :limit OFFSET :offset
                `, {
                    replacements: { 
                        searchPattern: `%${sanitizedSearch}%`, 
                        limit, 
                        offset 
                    },
                    type: sequelize.QueryTypes.SELECT,
                    model: Items,
                    mapToModel: true
                }),
                sequelize.query(`
                    SELECT COUNT(*) as count 
                    FROM items 
                    WHERE 
                        title ILIKE :searchPattern OR
                        description ILIKE :searchPattern OR
                        category ILIKE :searchPattern
                `, {
                    replacements: { 
                        searchPattern: `%${sanitizedSearch}%`
                    },
                    type: sequelize.QueryTypes.SELECT
                })
            ]);
            
            result = {
                rows: rows,
                count: parseInt(count[0].count)
            };
        } 
        
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

        if (page === 1 && !category && !search) {
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
        await Items.create(newItem);
        await cacheItem(newItem.id, newItem);
        await invalidatePopularItemsCache();
        res.status(201).json({ message: 'Item created successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Item creation failed' })
    }
});

router.get('/user/:userId?', async(req, res) => {
    try {
        let userId = req.params.userId;

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let loggedInUserId = null;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            loggedInUserId = decoded.userId;
        }
        if (userId == -1) {
            userId = loggedInUserId;
        }

        const items = await Items.findAll({ where: { sellerId: userId, available: true }, order: [['name', 'ASC']] });

        const isOwner = userId == loggedInUserId;

        let username = await getCachedUser(userId);
        if (!username) {
            const user = await Users.findOne({ where: { id: userId } });
            username = user.username;
            await cacheUser(userId, username);
        }
        
        res.status(200).json({
            items,
            isOwner,
            username
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch items' });
    }
});

router.get('/:itemId', async(req, res) => {
    try {
        const itemId = req.params.itemId;

        let item = await getCachedItem(itemId);
        if (item) {
            console.log('Retrieved item from cache');
        } else {
            item = await Items.findOne({ where: { id: itemId } });
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            await cacheItem(itemId, item);
        }

        let sellerUsername = await getCachedUser(item.sellerId);
        if (!sellerUsername) {
            const user = await Users.findOne({ where: { id: item.sellerId } });
            sellerUsername = user.username;
            await cacheUser(item.sellerId, sellerUsername);
        }
        item = item.toJSON ? item.toJSON() : item;
        item.sellerUsername = sellerUsername;
        Items.increment('views', { where: { id: itemId } });
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
        await invalidatePopularItemsCache();
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