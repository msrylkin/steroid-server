import { trace } from 'console';
import { Op } from 'sequelize';
import { Environment, Measurement } from 'src/models';
import { CodePlace } from 'src/models/CodePlace';
import { Trace } from '../models';
import { findStatementEnding } from './sources.service';

type MeasurementParam  =  [number, number];

interface TraceParam {
    fileName: string;
    columnNumber: number;
    lineNumber: number;
    measurements: MeasurementParam[];
}

interface TraceLike {
    fileName: string;
    columnNumber: number;
    lineNumber: number;
}

interface QueriesMeasurements {
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
    const existingCodePlaces = await CodePlace.findAll({
        where: {
            releaseId,
        },
    });

    for (const query of queries) {
        let codePlace = existingCodePlaces.find(codePlace => isEqualCodePlace(query, codePlace));

        if (!codePlace) {
            codePlace = await CodePlace.create({
                releaseId,
                fileName: query.fileName,
                startColumn: query.columnNumber,
                startLine: query.lineNumber,
                type: 'query',
            });
        }

        codePlace.executionTime = recalculateWeightedAverage({
            previousAverage: codePlace.executionTime,
            previousCount: codePlace.hitCount,
            newNumbers: query.measurements.map(e => e[0]),
        });
        codePlace.hitCount = codePlace.hitCount + query.measurements.length;

        for (const caller of query.callers) {
            let callerCodePlace = existingCodePlaces.find(codePlace => isEqualCodePlace(caller, codePlace));

            if (!callerCodePlace) {
                callerCodePlace = await CodePlace.create({
                    releaseId,
                    fileName: query.fileName,
                    startColumn: query.columnNumber,
                    startLine: query.lineNumber,
                    type: 'caller',
                });
            }
        }
    }
}

export async function saveTraces2(env: Environment, traces: TraceParam[]) {
    const existingTraces = await Trace.findAll({
        where: {
            commit: env.commit,
            environmentId: env.id,
            [Op.or]: traces.map(({ fileName, columnNumber, lineNumber }) => ({
                fileName,
                columnNumber,
                lineNumber,
            })),
        },
    });
    // const newTraces = traces.filter(({ fileName, columnNumber, lineNumber }) => !existingTraces.some(existingTrace => {
    //     return existingTrace.fileName === fileName && existingTrace.columnNumber === columnNumber && existingTrace.lineNumber === lineNumber;
    // }));
    const newTraces = traces.filter(traceData => !existingTraces.some(existingTrace => isSameTrace(traceData, existingTrace)));

    for (const existingTrace of existingTraces) {
        const { measurements } = traces.find(traceData => isSameTrace(traceData, existingTrace));
        await Measurement.bulkCreate(measurements.map(measurement => ({
            ...mapToMeasurement(measurement),
            traceId: existingTrace.id,
        })));
    }

    await Trace.bulkCreate(newTraces.map(trace => ({
        environmentId: env.id,
        commit: env.commit,
        fileName: trace.fileName,
        columnNumber: trace.columnNumber,
        lineNumber: trace.lineNumber,
        measurements: trace.measurements.map(measure => mapToMeasurement(measure)),
    })), {
        include: [Measurement],
    });
}

export async function getTraceState(commit: string) {
    const envWithTraces = await Environment.findOne({
        where: {
            commit
        },
        include: [{
            association: Environment.traces,
            include: [{
                association: Trace.measurements,
                required: true,
            }],
        }],
    });

    if (!envWithTraces) {
        return {
            name: '',
            commit,
            traces: [],
        };
    }

    const tracesWithEndings = [];

    for (const trace of envWithTraces.traces) {
        // if (trace.lineNumber !== 6 || trace.columnNumber !== 5) {
        //     // console.log('trace', trace)
        //     // continue;
        // }
        if (trace.id !== 75) {
            // continue;
        }
        const searchResult = await findStatementEnding({
            commit,
            env: envWithTraces,
            fileName: trace.fileName,
            lineNumber: trace.lineNumber,
            columnNumber: trace.columnNumber,
        });

        if (!searchResult) {
            continue;
        }

        tracesWithEndings.push({
            fileName: trace.fileName,
            startColumnNumber: trace.columnNumber,
            startLineNumber: trace.lineNumber,
            endColumnNumber: searchResult.endColumn,
            endLineNumber: searchResult.endLine,
            state: calculateState(trace.measurements)
        });
    }

    const result = {
        name: envWithTraces.name,
        commit: envWithTraces.commit,
        // traces: envWithTraces.traces.map(trace => ({
        //     fileName: trace.fileName,
        //     columnNumber: trace.columnNumber,
        //     lineNumber: trace.lineNumber,
        //     state: calculateState(trace.measurements)
        // })),
        traces: tracesWithEndings,
    };
    
    return result;
}

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

function calculateState(measurements: Measurement[]) {
    const sum = measurements.reduce((acc, { seconds, nanoseconds }) => acc + seconds * 1000 + nanoseconds / 1000000, 0); // ms
    const avg = sum / measurements.length;

    return {
        avg,
        colour: getColour(avg),
    };
}

interface WieightedAverageParams {
    previousAverage: number;
    previousCount: number;
    newNumbers: number[];
}

function recalculateWeightedAverage(param: WieightedAverageParams) {
    if (!param.newNumbers.length) {
        return param.previousAverage;
    }
    const newTotalCount = param.previousCount + param.newNumbers.length;
    const previousAverageWeight = param.previousCount / newTotalCount;
    const newAverageWeight = (1 - previousAverageWeight) / param.newNumbers.length;
    const weighededNewNumbers = param.newNumbers.map(num => num * newAverageWeight);
    return (param.previousAverage * previousAverageWeight + weighededNewNumbers.reduce((acc, num) => acc + num, 0)) / newTotalCount;
}
