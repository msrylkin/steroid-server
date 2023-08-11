import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const isAws = !!process.env.STAGE;

export const S3 = new S3Client({
    // credentials: {
    //     accessKeyId: isAws ? undefined : 'S3RVER', // This specific key is required when working offline
    //     secretAccessKey: isAws ? undefined : 'S3RVER',
    // },
    // endpoint: isAws ? undefined : 'http://localhost:4569',
});

export function getPutPresignedUrl(input: ConstructorParameters<typeof PutObjectCommand>[0]) {
    const command = new PutObjectCommand(input);
    return getSignedUrl(S3, command, { expiresIn: 15 * 60 });
}

export function getObject(input: ConstructorParameters<typeof GetObjectCommand>[0]) {
    const command = new GetObjectCommand(input);
    return S3.send(command);
}

export function headObject(input: ConstructorParameters<typeof HeadObjectCommand>[0]) {
    const command = new HeadObjectCommand(input);
    return S3.send(command);
}