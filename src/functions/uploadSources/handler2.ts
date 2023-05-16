import { getEnvironemnt } from 'src/services/environment.service';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
import { S3 } from 'src/sdk/s3.sdk';

const upload: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const env = await getEnvironemnt(event.headers['token']);

    if (!env) {
        console.error('env not found', event.headers['token']);
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'env not found'
            })
        };
    }

    const randomID = parseInt(Math.random() * 10000000 + '');
    const signedUrl = await S3.getSignedUrlPromise('putObject', {
        Bucket: 'local-bucket',
        Key: `sources/env:${env.id}/commit:${event.body.commit}/${randomID}`,
        Expires: 60 * 5,
        ContentType: 'application/zip',
        Metadata: {
            'test1': 'testasdzxc',
        },
        // 'x-amz-meta-test': 'testzxc'
    });

    // S3.putObject({
    //     Bucket: 'local-bucket',
    //     Key: '1234',
    //     Body: Buffer.from('abcd')
    //   }, () => {} );
    return {
        statusCode: 200,
        body: JSON.stringify({
            url: signedUrl,
        }),
    };
}

export const main = middyfy(upload, { schema });
