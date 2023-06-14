import type { AWS } from '@serverless/typescript';

import trace from '@functions/trace';
import getState  from '@functions/getState';
import s3Handler from '@functions/s3';
import createUploadLink from '@functions/createUploadLink';
import test from '@functions/test';

const serverlessConfiguration: AWS = {
  service: 'steroid-backend',
  frameworkVersion: '2',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-s3-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { trace, getState, s3Handler, createUploadLink, test },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    'serverless-offline': {
      httpPort: 3088
    },
    s3: {
      host: 'localhost',
      directory: '/tmp'
    }
  },
  resources: {
    Resources: {
      ImagesS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'local-bucket'
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
