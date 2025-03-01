const express = require('express');
const router = express.Router();
const { generatePresignedUrl } = require('../utils/s3');
const authenticateToken = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const Items = require('../models/items')

router.get('/', async(req, res) => {
    try {
        const items = await Items.findAll();
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to fetch items'});
    }
});

router.post('/', authenticateToken, async(req, res) => {
    try {   
        const { name, price, description, images } = req.body;
        const userId = req.user.userId;
        const newItem = {
            title: name,
            price: price,
            description: description,
            images: images,
            sellerId: userId,
            available: true
        }
        await Items.create(newItem)
        res.status(201).json({ message: 'Item created successfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Item creation failed' })
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