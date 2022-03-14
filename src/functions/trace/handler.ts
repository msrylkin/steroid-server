import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getEnvironemnt } from 'src/services/environment.service';
import { saveTraces } from 'src/services/trace.service';

import schema from './schema';

const trace: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    // console.log(event.body.traces[0])
    const env = await getEnvironemnt(event.headers['token']);

    if (!env) {
        console.error('env not found', event.headers['token'])
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'env not found'
            })
        };
    }

    await saveTraces(env, event.body.traces);
    return formatJSONResponse({
        message: `Hello ${JSON.stringify(event.body)}, welcome to the exciting Serverless world!`,
        event,
    });
}
  
export const main = middyfy(trace);