import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const isAws = process.env.IS_OFFLINE !== 'true';

const params: ConstructorParameters<typeof S3Client>[0] = {};
console.log('isAws', process.env.STAGE);
console.log('offline', process.env.IS_OFFLINE);
if (!isAws) {
    console.log('here')
    params.forcePathStyle = true;
    params.credentials = {
        accessKeyId: 'S3RVER', // This specific key is required when working offline
        secretAccessKey: 'S3RVER',
    };
    params.endpoint = 'http://localhost:4569';
}

export const S3 = new S3Client(params);

export function getPutPresignedUrl(input: ConstructorParameters<typeof PutObjectCommand>[0]) {
    const command = new PutObjectCommand(input);
    return getSignedUrl(S3, command, { expiresIn: 15 * 60 });
}

export function getObject(input: ConstructorParameters<typeof GetObjectCommand>[0]) {
    const command = new GetObjectCommand(input);
    return S3.send(command);
}

export function headObject(input: ConstructorParameters<typeof HeadObjectCommand>[0]) {
    console.log(S3.config.credentials);
    const command = new HeadObjectCommand(input);
    return S3.send(command);
}