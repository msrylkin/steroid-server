import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Release } from 'src/models/Release';
import { Op } from "@sequelize/core";
import { CodePlace } from 'src/models/CodePlace';
import { Tracker } from 'src/models/Tracker';

function findLatestRelease(commits: string[]) {
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

export const main = middyfy(getState);