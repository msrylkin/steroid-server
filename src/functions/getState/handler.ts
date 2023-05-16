import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Release } from 'src/models/Release';
import { getClientByApiKey } from 'src/services/client.service';
import { getTraceState } from 'src/services/trace.service';
import { Op } from 'sequelize';
import { CodePlace } from 'src/models/CodePlace';
import { Tracker } from 'src/models/Tracker';

function findLatestRelease(commits: string[]) {
    console.log('commits', commits)
    return Release.findOne({
        where: {
            commit: {
                [Op.in]: commits,
            },
        },
        include: [{
            association: Release.codePlaces,
            include: [{
                association: CodePlace.tracker,
                include: [{
                    association: Tracker.measurements,
                }],
            }],
        }],
        order: [['createdAt', 'DESC']],
    });
}

const getState : ValidatedEventAPIGatewayProxyEvent<any> = async (event) => {
    const commits = event.multiValueQueryStringParameters.commits;

    const latestRelease = await findLatestRelease(commits);

    if (!latestRelease) {
        console.log('not found release')
        return {
            statusCode: 200,
            body: null,
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            latestRelease,
        }),
    };
}

const getState2: ValidatedEventAPIGatewayProxyEvent<undefined> = async (event) => {
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