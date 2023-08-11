import * as AWS from "aws-sdk";

const isAws = !!process.env.STAGE;

const S3 = new AWS.S3({
    s3ForcePathStyle: true,
    accessKeyId: isAws ? undefined : 'S3RVER', // This specific key is required when working offline
    secretAccessKey: isAws ? undefined : 'S3RVER',
    endpoint: isAws ? undefined : new AWS.Endpoint('http://localhost:4569'),
});

export { S3 };