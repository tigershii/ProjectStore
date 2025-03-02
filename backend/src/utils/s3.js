const { S3Client, PutObjectCommand, DeleteObjectsCommand, waitUntilObjectNotExists } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function generatePresignedUrl(key, contentType, expiresIn = 60) {
    const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
    });
    try {
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
        return signedUrl;
    } catch (error) {
        console.error('Error generating presigned URL:', error);
        throw error;
    }
}

async function deleteFromS3(keys) {
    const command = new DeleteObjectsCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: {
            Objects: keys,
        }
    });
    try {
        const { Deleted } = await s3Client.send(command);
        for (key in keys) {
            await waitUntilObjectNotExists(
                { s3Client },
                { Bucket: process.env.S3_BUCKET_NAME, Key: key }
            );
        }
        console.log('Deleted objects:', Deleted);
    } catch (error) {
        console.log("Error deleting objects:", error);
    }
}

module.exports = {
    generatePresignedUrl,
    deleteFromS3
}