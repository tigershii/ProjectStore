const express = require('express');
const router = express.Router();
const { generatePresignedUrl } = require('../utils/s3');
const { v4: uuidv4 } = require('uuid');

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