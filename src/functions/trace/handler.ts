import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Release } from 'src/models/Release';
import { saveTraces } from 'src/services/trace.service';

import schema from './schema';

const trace: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const release = await Release.findOne({
        order: [['createdAt', 'DESC']]
    });

    if (!release) {
        return formatJSONResponse({
            message: `no release`,
            event,
        });
    }

    try {
        await saveTraces(release.id, event.body.queries);
        return formatJSONResponse({
            message: `Hello ${JSON.stringify(event.body)}, welcome to the exciting Serverless world!`,
            event,
        }); 
    } catch (err) {
        console.log(err)
        throw err;
    }
}
  
export const main = middyfy(trace);