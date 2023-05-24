import { middyfy } from "@libs/lambda";
import { Handler, S3Event, S3EventRecord } from "aws-lambda";
import { S3 } from "src/sdk/s3.sdk";
import * as yauzl from 'yauzl';
import { promisify } from 'util';
import { Release } from "src/models/Release";
import { CodePlace } from "src/models/CodePlace";
import * as diff from 'diff';
import { Op } from "sequelize";

const zipFromBuffer = promisify(yauzl.fromBuffer.bind(yauzl)); // TODO: use https://www.npmjs.com/package/unzipper

const s3Handler: Handler<S3Event> = async (event) => {
    for (const record of event.Records) {
        await handleS3Record(record).catch(err => {
            console.log(err)
            throw err;
        });
    }
}

async function handleS3Record(record: S3EventRecord) {
    const head = await S3.headObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
    }).promise();
    
    const commit: string = head.Metadata.commit;
    const uploadId: string = head.Metadata['upload-id'];

    if (!commit) {
        return;
    }
    const newRelease = await Release.create({
        commit,
        uploadId,
        status: 'active',
    });

    const previousRelease = await Release.findOne({
        where: {
            id: { [Op.notIn]: [newRelease.id] },
        },
        order: [['createdAt', 'DESC']],
    });

    if (!previousRelease) {
        return;
    }

    const { Body } = await S3.getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
    }).promise();
    const { Body: previousReleaseBody } = await S3.getObject({
        Bucket: 'local-bucket',
        Key: `sources/commit:${previousRelease.commit}/${previousRelease.uploadId}`,
    }).promise();
    
    if (!Body || !(Body instanceof Buffer) || !previousReleaseBody || !(previousReleaseBody instanceof Buffer)) {
        return;
    }
    
    const currentFiles = await unzipArchive(Body);
    const previousFiles = await unzipArchive(previousReleaseBody);

    for (const file of currentFiles) {
        const previousFile = previousFiles.find(({ path }) => path === file.path);

        if (!previousFile) {
            continue;
        }

        const previousReleaseCodePlaces = await CodePlace.findAll({
            where: {
                releaseId: previousRelease.id,
                fileName: file.path,
            },
        });

        for (const codePlace of previousReleaseCodePlaces) {
            const offset = getOffsetIfCodeSame(codePlace.startLine - 1, codePlace.endLine - 1, previousFile.content, file.content);

            if (offset !== undefined) {
                await CodePlace.create({
                    ...codePlace.toJSON(),
                    startLine: codePlace.startLine + offset,
                    endLine: codePlace.endLine + offset,
                    releaseId: newRelease.id,
                    id: undefined,                                                                                               
                });
            }
        }
    }
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
		// console.log('diff', diff.value)
		// console.log('trackingOriginalStartlLine', trackingOriginalStartlLine)
		// console.log('trackingOriginalEndLine', trackingOriginalEndLine)
		// console.log('originalIndex', originalIndex)
		// console.log('modifiedIndex', modifiedIndex)
		// console.log('===============')

		if (
			trackingOriginalStartlLine >= originalIndex
			&& trackingOriginalEndLine < originalIndex + (diff.count || 0)
			&& (diff.removed || (!diff.removed && !diff.added))
		) {
			if (diff.removed) {
				return undefined;
			} else {
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

	// console.log('originalIndex', originalIndex);
	// console.log('modifiedIndex', modifiedIndex);
}

async function unzipArchive(data: Buffer) {
    const zipArchive: yauzl.ZipFile = await zipFromBuffer(data, { lazyEntries: true });
    const openReadStream = promisify(zipArchive.openReadStream.bind(zipArchive));

    zipArchive.readEntry();

    const files: { path: string; content: string }[] = [];

    zipArchive.on('entry', async (entry: yauzl.Entry) => {
        if (!entry.fileName || !entry.fileName.length || entry.fileName[entry.fileName.length - 1] === '/') {
            zipArchive.readEntry();
            return;
        }
        const fileName = `/${entry.fileName}`;
        const stream = await openReadStream(entry);
        const buffers = [];

        for await (const data of stream) {
            buffers.push(data);
        }

        const buffer = Buffer.concat(buffers);
        const file = buffer.toString('utf-8');

        files.push({
            path: fileName,
            content: file,
        });

        zipArchive.readEntry();
    });

    await new Promise((resolve) => zipArchive.on('end', resolve));

    return files;
}

export const main = middyfy(s3Handler);
