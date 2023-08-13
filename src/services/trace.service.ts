import { trace } from 'console';
import { Op } from 'sequelize';
import { Environment, Measurement, Release } from 'src/models';
import { CodePlace } from 'src/models/CodePlace';
import { Path } from 'src/models/Path';
import { Tracker } from 'src/models/Tracker';
// import { Trace } from '../models';
import { findStatementEnding } from './sources.service';

type MeasurementParam = [number, number];

export interface TraceLike {
    fileName: string;
    columnNumber: number;
    lineNumber: number;
}

export interface QueriesMeasurements {
    fileName: string;
    columnNumber: number;
    lineNumber: number;
    measurements: MeasurementParam[];
    callers: TraceLike[];
}

// enum Colours {
//     red = '#FF0000',
//     green = '#00FF00',
//     orange = '#FFA500',
// }
enum Colours {
    red = 'rgba(255, 0, 0, 0.5)',
    green = 'rgba(0, 255, 0, 0.5)',
    orange = 'rgba(255, 165, 0, 0.5)'
}

export async function saveTraces(releaseId: number, queries: QueriesMeasurements[]) {
    const release = await Release.findByPk(releaseId, { rejectOnEmpty: true });
    const trackersToSave: Tracker[] = [];

    for (const query of queries) {
        const callersToSave: CodePlace[] = [];
        let existingCodePlaces = await CodePlace.findAll({
            where: {
                releaseId,
            },
        });

        let codePlace = existingCodePlaces.find(codePlace => isEqualCodePlace(query, codePlace));

        if (!codePlace) {
            const tracker = await Tracker.create({
                name: 'sample query tracker',
            });
            const searchResult = await findStatementEnding({
                fileName: query.fileName,
                columnNumber: query.columnNumber,
                lineNumber: query.lineNumber,
                commit: release.commit,
                env: new Environment(),
            });
            codePlace = await CodePlace.create({
                releaseId,
                fileName: query.fileName,
                startColumn: query.columnNumber,
                startLine: query.lineNumber,
                endColumn: searchResult.endColumn,
                endLine: searchResult.endLine,
                type: 'query',
                trackerId: tracker.id,
                status: 'active',
            });

            await Path.create({
                nodeId: codePlace.id,
                path: `${codePlace.id}`,
            })
        }

        codePlace.executionTime = recalculateWeightedAverage({
            previousAverage: codePlace.executionTime,
            previousCount: codePlace.hitCount,
            newNumbers: query.measurements.map(e => e[0]),
        });
        codePlace.hitCount = codePlace.hitCount + query.measurements.length;

        const callersIdsPath: number[] = [];

        for (const caller of query.callers) {
            existingCodePlaces = await CodePlace.findAll({
                where: {
                    releaseId,
                },
            });
            let callerCodePlace = existingCodePlaces.find(codePlace => isEqualCodePlace(caller, codePlace)) || callersToSave.find(codePlace => isEqualCodePlace(caller, codePlace));

            if (!callerCodePlace) {
                const tracker = await Tracker.create({
                    name: 'sample caller tracker',
                });
                const searchResult = await findStatementEnding({
                    fileName: caller.fileName,
                    columnNumber: caller.columnNumber,
                    lineNumber: caller.lineNumber,
                    commit: '1',
                    env: new Environment(),
                });
                callerCodePlace = await CodePlace.create({
                    releaseId,
                    fileName: caller.fileName,
                    startColumn: caller.columnNumber,
                    startLine: caller.lineNumber,
                    endColumn: searchResult.endColumn,
                    endLine: searchResult.endLine,
                    type: 'caller',
                    trackerId: tracker.id,
                    status: 'active',
                });
                callersToSave.push(callerCodePlace);
            }

            callersIdsPath.push(callerCodePlace.id);
        }

        // for (const callerToSave of callersToSave) {
        //     const savedCaller = await CodePlace.create(callerToSave.toJSON());
        //     callersIdsPath.push(savedCaller.id);
        //     await Path.create({
        //         nodeId: savedCaller.id,
        //         path: buildFullPath(codePlace.id, callersIdsPath),
        //     });
        // }

        for (let i = 0; i < callersIdsPath.length; i++) {
            const currentIdsPath = callersIdsPath.slice(0, i + 1);
            const callerId = callersIdsPath[i];

            const existingPath = await Path.findOne({
                where: {
                    nodeId: callerId,
                    path: buildFullPath(codePlace.id, currentIdsPath),
                }
            });

            if (!existingPath) {
                await Path.create({
                    nodeId: callerId,
                    path: buildFullPath(codePlace.id, currentIdsPath),
                });
            }
        }

        await codePlace.save();
    }

    // for (const callerToSave of callersToSave) {
    //     const savedCaller = await CodePlace.create(callerToSave.toJSON());
    // }

    // await CodePlace.bulkCreate(callersToSave.map(e => e.toJSON()));
}

// export async function getTraceState(commit: string) {
//     const envWithTraces = await Environment.findOne({
//         where: {
//             commit
//         },
//         include: [{
//             association: Environment.traces,
//             include: [{
//                 association: Trace.measurements,
//                 required: true,
//             }],
//         }],
//     });

//     if (!envWithTraces) {
//         return {
//             name: '',
//             commit,
//             traces: [],
//         };
//     }

//     const tracesWithEndings = [];

//     for (const trace of envWithTraces.traces) {
//         // if (trace.lineNumber !== 6 || trace.columnNumber !== 5) {
//         //     // console.log('trace', trace)
//         //     // continue;
//         // }
//         if (trace.id !== 75) {
//             // continue;
//         }
//         const searchResult = await findStatementEnding({
//             commit,
//             env: envWithTraces,
//             fileName: trace.fileName,
//             lineNumber: trace.lineNumber,
//             columnNumber: trace.columnNumber,
//         });

//         if (!searchResult) {
//             continue;
//         }

//         tracesWithEndings.push({
//             fileName: trace.fileName,
//             startColumnNumber: trace.columnNumber,
//             startLineNumber: trace.lineNumber,
//             endColumnNumber: searchResult.endColumn,
//             endLineNumber: searchResult.endLine,
//             state: calculateState(trace.measurements)
//         });
//     }

//     const result = {
//         name: envWithTraces.name,
//         commit: envWithTraces.commit,
//         // traces: envWithTraces.traces.map(trace => ({
//         //     fileName: trace.fileName,
//         //     columnNumber: trace.columnNumber,
//         //     lineNumber: trace.lineNumber,
//         //     state: calculateState(trace.measurements)
//         // })),
//         traces: tracesWithEndings,
//     };
    
//     return result;
// }

// private

function isSameTrace(trace1: TraceLike, trace2: TraceLike) {
    return trace1.fileName === trace2.fileName && trace1.columnNumber === trace2.columnNumber && trace1.lineNumber === trace2.lineNumber;
}

function isEqualCodePlace(query: TraceLike, codePlace: CodePlace) {
    return query.fileName === codePlace.fileName && query.columnNumber === codePlace.startColumn && query.lineNumber === codePlace.startLine;
}

function mapToMeasurement(measurementData: MeasurementParam) {
    return {
        seconds: measurementData[0],
        nanoseconds: measurementData[1],
    };
}

function getColour(avgTimeMs: number) {
    if (avgTimeMs < 500) {
        return Colours.green
    }

    if (avgTimeMs < 2000) {
        return Colours.orange
    }

    return Colours.red;
}

// function calculateState(measurements: Measurement[]) {
//     const sum = measurements.reduce((acc, { seconds, nanoseconds }) => acc + seconds * 1000 + nanoseconds / 1000000, 0); // ms
//     const avg = sum / measurements.length;

//     return {
//         avg,
//         colour: getColour(avg),
//     };
// }

interface WieightedAverageParams {
    previousAverage: number;
    previousCount: number;
    newNumbers: number[];
}

function recalculateWeightedAverage(param: WieightedAverageParams) {
    return 100;
    if (!param.newNumbers.length) {
        return param.previousAverage;
    }
    const newTotalCount = param.previousCount + param.newNumbers.length;
    const previousAverageWeight = param.previousCount / newTotalCount;
    const newAverageWeight = (1 - previousAverageWeight) / param.newNumbers.length;
    const weighededNewNumbers = param.newNumbers.map(num => num * newAverageWeight);
    return (param.previousAverage * previousAverageWeight + weighededNewNumbers.reduce((acc, num) => acc + num, 0)) / newTotalCount;
}

function buildFullPath(queryId: number, callerIds: number[]) {
    console.log('callerIds', callerIds)
    return `${queryId}.${callerIds.join('.')}`;
}
