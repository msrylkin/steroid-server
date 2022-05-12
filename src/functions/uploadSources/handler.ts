import { getEnvironemnt } from 'src/services/environment.service';
import { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import schema from './schema';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk';
import { S3 } from 'src/sdk/s3.sdk';
import { Release } from 'src/models/Release';
import { CodePlace } from 'src/models/CodePlace';
import { getFile } from 'src/services/storage.service';
import * as diff from 'diff';

const upload: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const token = event.headers['token'];
    const newFiles = event.body.files!;
    console.log('1', event.body)

    const previousRelease = await Release.findOne({
        include: [Release.codePlaces],
        order: [['createdAt', 'DESC']],
    });
    console.log('2', previousRelease)

    const newRelease = Release.build({ commit: event.body.commit, status: 'created' });

    if (previousRelease) {
        for (const codePlace of previousRelease.codePlaces) {
            const currentFileContent = newFiles.find(file => file.path === codePlace.fileName)?.content;

            if (!currentFileContent) {
                continue;
            }

            const previousFileContent = await getFile(previousRelease.commit, codePlace.fileName);

            if (!previousFileContent) {
                continue;
            }

            const offset = getOffsetIfCodeSame(codePlace.startLine, codePlace.endLine, previousFileContent, currentFileContent as string);

            if (offset !== undefined) {
                newRelease.codePlaces.push(CodePlace.build({
                    ...codePlace,
                    startLine: codePlace.startLine + offset,
                    endLine: codePlace.endLine + offset,
                }));
            }
        }
    }

    newRelease.status = 'processed';

    await newRelease.save();

    return {
        statusCode: 200,
        body: '{}',
    };
}

function getOffsetIfCodeSame(
    previousLineStart: number,
    previousLineEnd: number,
    previousFileContent: string,
    newFileConent: string,
) {
    const diffs = diff.diffLines(previousFileContent, newFileConent);
    const offset = getOffset(previousLineStart, previousLineEnd, diffs);
    return offset;

}

function getOffset(trackingOriginalStartlLine: number, trackingOriginalEndLine: number, diffs: diff.Change[]) {
	let originalIndex = 0;
	let modifiedIndex = 0;

	for (const diff of diffs) {
		console.log('diff', diff)
		console.log('trackingOriginalStartlLine', trackingOriginalStartlLine)
		console.log('trackingOriginalEndLine', trackingOriginalEndLine)
		console.log('originalIndex', originalIndex)
		console.log('modifiedIndex', modifiedIndex)
		console.log('===============')

		if (
			trackingOriginalStartlLine >= originalIndex + 1
			&& trackingOriginalEndLine < 1 + originalIndex + (diff.count || 0)
			&& (diff.removed || (!diff.removed && !diff.added))
		) {
			if (diff.removed) {
				return undefined;
			} else {
				const localOffset = trackingOriginalStartlLine - originalIndex - 1;
				return modifiedIndex - originalIndex;
			}
		}

		if (diff.removed) {
			originalIndex += diff.count || 0;
		} else if (diff.added) {
			modifiedIndex += diff.count || 0;
		} else {
			modifiedIndex += diff.count || 0;
			originalIndex += diff.count || 0;
		}
	}

	console.log('originalIndex', originalIndex);
	console.log('modifiedIndex', modifiedIndex);
}

const upload2: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
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
            'test1': 'testasdzxc'
        }
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
