import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Release } from 'src/models';
import { Op } from "sequelize";
import { CodePlace } from 'src/models/CodePlace';
import { Tracker } from 'src/models/Tracker';

function findLatestRelease(commits: string[]) {
    console.log([{
        association: Release.codePlaces,
        include: [{
            association: CodePlace.tracker,
            include: [{
                association: Tracker.measurements,
            }],
        }],
    }])
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
            body: JSON.stringify({ latestRelease: null }),
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