const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
import { env } from '../config/env';

const s3Client = new S3Client({
    region: env.awsRegion,
    credentials: {
        accessKeyId: env.awsAccessKeyId,
        secretAccessKey: env.awsSecretAccessKey
    }
});

async function createSignedAudioUrl(bucket: string, key: string) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

module.exports = {
    createSignedAudioUrl
};