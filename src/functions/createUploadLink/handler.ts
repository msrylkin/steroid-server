import { ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import schema from "./schema";
import { S3 } from 'src/sdk/s3.sdk';
import { middyfy } from '@libs/lambda';

const createUploadLink: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    console.log('commit', event.body.commit);
    const randomID = parseInt(Math.random() * 10000000 + '');
    const signedUrl = await S3.getSignedUrlPromise('putObject', {
        Bucket: 'sources-archives',
        Key: `sources/commit:${event.body.commit}/${randomID}`,
        Expires: 60 * 5 * 100000000,
        ContentType: 'application/zip',
        Metadata: {
            commit: event.body.commit,
            'upload-id': String(randomID),
        },
    });

    return {
        statusCode: 200,
        body: JSON.stringify({
            url: signedUrl,
        }),
    };
}

export const main = middyfy(createUploadLink, { schema });