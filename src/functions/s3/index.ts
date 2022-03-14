import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
        s3: {
            bucket: 'local-bucket',
            event: 's3:*'
        }
    }
  ]
}