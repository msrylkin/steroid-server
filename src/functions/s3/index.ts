import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
        s3: {
            bucket: 'sources-archives',
            event: 's3:*'
        }
    }
  ]
}