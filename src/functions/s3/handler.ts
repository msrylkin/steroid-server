import { middyfy } from "@libs/lambda";
import { Handler, S3Event } from "aws-lambda";
import { S3 } from "src/sdk/s3.sdk";
import * as yauzl from 'yauzl';
import { promisify } from 'util';

const openZipFile = promisify(yauzl.open.bind(yauzl));

const s3Handler: Handler<S3Event> = async (event) => {
    for (const record of event.Records) {
        const head = await S3.headObject({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
        }).promise();
        
        const uploadId = head.Metadata.uploadId;

        if (!uploadId) {
            continue;
        }

        
    }
}

export const main = middyfy(s3Handler);
