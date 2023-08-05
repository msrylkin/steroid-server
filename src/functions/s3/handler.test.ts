const mS3Instance = {
    headObject: jest.fn().mockReturnThis(),
    getObject: jest.fn().mockReturnThis(),
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    // Endpoint: jest.fn().mockImplementation(() => ({}))
  };

jest.mock('@middy/core', () => ({
    __esModule: true,
    default: (handler) => {
        console.log('mocking @middy/core...')
        return {
            use: jest.fn().mockReturnValue(handler)
        }
    }
}));

jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => mS3Instance),
        Endpoint: jest.fn().mockImplementation(() => ({}))
    };
  });

import { S3EventRecord } from 'aws-lambda';
import { Release } from 'src/models/Release';
import { seedCodePlace, seedRelease } from 'src/tests/seeds';
import { main as s3Handler } from './handler';

describe('s3 handler', () => {
    const event = {
        "Records": [{
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-1",
            "eventTime": "2023-07-23T20:35:05.795Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "AWS:BE13DB042BE3F70CA7AF0"
            },
            "requestParameters": {
                "sourceIPAddress": "127.0.0.1"
            },
            "responseElements": {
                "x-amz-request-id": "FF7D271436D284A1",
                "x-amz-id-2": "l014BiAHlh/oa5Tm2j47w8/FD4qMRdvbxO4Gi4o1UBw="
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "testConfigId",
                "bucket": {
                    "name": "local-bucket",
                    "ownerIdentity": {
                        "principalId": "8ECD361D0C3207"
                    },
                    "arn": "arn:aws:s3: : :local-bucket"
                },
                "object": {
                    "key": "sources/commit:931158a58842c57042d19da81eb0d0718327eb53/4646506",
                    "sequencer": "18984767FC3",
                    "size": 10774,
                    "eTag": "a791f8eab1bf180be16491c16b886594"
                }
            }
        }]
    };

    const head = {
        "AcceptRanges": "bytes",
        "LastModified": "2023-07-23T22:21:53.000Z",
        "ContentLength": 10774,
        "ETag": "\"a791f8eab1bf180be16491c16b886594\"",
        "ContentType": "application/zip",
        "Metadata": {
            "commit": "931158a58842c57042d19da81eb0d0718327eb53",
            "upload-id": "4646506"
        }
    };

    it('creates new release without codeplaces', async () => {
        mS3Instance
            .promise
            .mockResolvedValueOnce(head);

        await s3Handler(event, null, null);

        const releases = await Release.findAll();
        expect(releases).toHaveLength(1)
        expect(releases[0]).toBeTruthy();
        expect(releases[0].commit).toEqual(head.Metadata.commit);
    });

    it('creates new release and moves codeplaces', async () => {
        mS3Instance
            .promise
            .mockResolvedValueOnce(head);
        
        const release = await seedRelease({
            commit: '123',
            status: 'active',
            uploadId: '1',
        });

        await seedCodePlace({
            startLine: 1,
            startColumn: 1,
            endLine: 1,
            endColumn: 1,
            releaseId: release.id,
        });
    });
});