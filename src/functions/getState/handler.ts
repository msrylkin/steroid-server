import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { getClientByApiKey } from 'src/services/client.service';
import { getTraceState } from 'src/services/trace.service';

const getState: ValidatedEventAPIGatewayProxyEvent<undefined> = async (event) => {
    const apiKey = event.headers['apiKey'];

    if (!apiKey) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'api key is not provided'
            }),
        };
    }

    const client = await getClientByApiKey(apiKey);

    if (!client) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'api key is wrong'
            }),
        };
    }

    const { commit } = event.queryStringParameters || {};

    if (!commit) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                error: 'wrong params'
            }),
        };
    }

    const result = await getTraceState(commit);

    return {
        statusCode: 200,
        body: JSON.stringify(result),
    }
}

export const main = middyfy(getState);