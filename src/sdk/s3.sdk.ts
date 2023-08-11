import { S3 } from "@aws-sdk/client-s3";

// const isAws = !!process.env.STAGE;

// const S3 = new S3Class({
//     accessKeyId: isAws ? undefined : 'S3RVER', // This specific key is required when working offline
//     secretAccessKey: isAws ? undefined : 'S3RVER',
//     endpoint: isAws ? undefined : new AWS.Endpoint('http://localhost:4569'),
// });

export { S3 };