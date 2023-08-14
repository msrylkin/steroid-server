import { middyfy } from "@libs/lambda";
import { Handler, S3Event, S3EventRecord } from "aws-lambda";
import { S3, getObject, headObject } from "src/sdk/s3.sdk";
import { promisify } from 'util';
import { Release } from "src/models/Release";
import { CodePlace } from "src/models/CodePlace";
import * as diff from 'diff';
import { Op } from "sequelize";
import { Path } from "src/models/Path";
import { unzipArchive } from "src/services/archive.service";

const s3Handler: Handler<S3Event> = async (event) => {
    for (const record of event.Records) {
        await handleS3Record(record).catch(err => {
            console.log(err)
            throw err;
        });
    }
}

async function handleS3Record(record: S3EventRecord) {
    console.log('before head object', record.s3)
    const head = await headObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
    });
    console.log('head object response', JSON.stringify(head));
    
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

    const { Body: currentReleaseStream } = await getObject({
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
    });
    const currentReleaseBuffer = currentReleaseStream && Buffer.from(await currentReleaseStream.transformToByteArray());
    console.log('getobject 1', currentReleaseBuffer instanceof Buffer, currentReleaseBuffer);
    const { Body: previousReleaseStream } = await getObject({
        Bucket: 'sources-archives',
        Key: `sources/${previousRelease.commit}/${previousRelease.uploadId}`,
    });
    const previousReleaseBuffer = previousReleaseStream && Buffer.from(await previousReleaseStream.transformToByteArray());
    console.log('get object 2', previousReleaseBuffer instanceof Buffer, previousReleaseBuffer);
    
    if (!currentReleaseBuffer || !(currentReleaseBuffer instanceof Buffer) || !previousReleaseBuffer || !(previousReleaseBuffer instanceof Buffer)) {
        return;
    }
    
    const currentFiles = await unzipArchive(currentReleaseBuffer);
    console.log('unzipped current', currentFiles);
    const previousFiles = await unzipArchive(previousReleaseBuffer);
    console.log('unzipped previous', previousFiles);

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

    // const createdCodePlaceQueries = await CodePlace.findAll({
    //     where: {
    //         releaseId: newRelease.id,
    //         type: 'query',
    //     },
    // });

    // for (const query of createdCodePlaceQueries) {
    //     const previousCodePlace = await CodePlace.findOne({
    //         where: {
    //             ...cre
    //         }
    //     })
    // }
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

export const main = s3Handler;
