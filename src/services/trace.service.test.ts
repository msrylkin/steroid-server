import { Environment } from "src/models/Environment";
import { Client } from "src/models/Client";
import { CodePlace } from "src/models/CodePlace";
import { Measurement } from "src/models/Measurement";
import { TraceLike, QueriesMeasurements } from "./trace.service";
import { Path } from "src/models/Path";
import { Release } from "src/models/Release";
import { Tracker } from "src/models/Tracker";
import { faker } from '@faker-js/faker';
import * as traceService from "./trace.service";
import * as storageService from "./storage.service";
import * as sourcesService from "./sources.service";

describe(__filename, () => {
    beforeEach(async () => {
        try {
            await Path.truncate({ cascade: true });
            await Measurement.truncate({ cascade: true });
            await CodePlace.truncate({ cascade: true });
            await Release.truncate({ cascade: true });
            await Tracker.truncate({ cascade: true });
        } catch (e) {
            console.log(e)
            throw e
        }
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    const query1 = {
        fileName: 'serviceA',
        lineNumber: 1,
        columnNumber: 1,
    };
    const query2 = {
        fileName: 'serviceA',
        lineNumber: 2,
        columnNumber: 2,
    };

    const callerA = {
        fileName: 'serviceA',
        lineNumber: 10,
        columnNumber: 10,
    };
    const callerB = {
        fileName: 'serviceA',
        lineNumber: 20,
        columnNumber: 20,
    };
    const callerC = {
        fileName: 'controllerA',
        lineNumber: 30,
        columnNumber: 30,
    };
    const callerD = {
        fileName: 'controllerB',
        lineNumber: 40,
        columnNumber: 40,
    };

    const traces: QueriesMeasurements[] = [{
        ...query1,
        measurements: [[300,100]],
        callers: [callerA, callerB, callerC],
    }, {
        ...query2,
        measurements: [[100,100]],
        callers: [callerA, callerB, callerD],
    }];

    it('saves traces first time', async () => {
        const release = await seedRelease();
        jest.spyOn(sourcesService, 'findStatementEnding').mockResolvedValue({ endColumn: 1, endLine: 1 });
        await traceService.saveTraces(release.id, traces);

        const paths = await Path.findAll({ order: [['path', 'ASC']] });

        const mappedPaths = paths.map(({ path }) => path);

        const query1Instance = await getCodePlaceInstance(query1);
        const query2Instance = await getCodePlaceInstance(query2);

        const callerAInstance = await getCodePlaceInstance(callerA);
        const callerBInstance = await getCodePlaceInstance(callerB);
        const callerCInstance = await getCodePlaceInstance(callerC);
        const callerDInstance = await getCodePlaceInstance(callerD);

        const expectedPath = buildTestPath([
            [query1Instance],
            [query1Instance, callerAInstance],
            [query1Instance, callerAInstance, callerBInstance],
            [query1Instance, callerAInstance, callerBInstance, callerCInstance],
            [query2Instance],
            [query2Instance, callerAInstance],
            [query2Instance, callerAInstance, callerBInstance],
            [query2Instance, callerAInstance, callerBInstance, callerDInstance],
        ]);

        expect(mappedPaths).toEqual(expectedPath);
    });

    it('saves traces second time', async () => {
        const release = await seedRelease();
        jest.spyOn(sourcesService, 'findStatementEnding').mockResolvedValue({ endColumn: 1, endLine: 1 });

        const query1Instance = await seedCodePlace({
            fileName: query1.fileName,
            startLine: query1.lineNumber,
            startColumn: query1.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });
        const callerAInstance = await seedCodePlace({
            fileName: callerA.fileName,
            startLine: callerA.lineNumber,
            startColumn: callerA.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });
        const callerBInstance = await seedCodePlace({
            fileName: callerB.fileName,
            startLine: callerB.lineNumber,
            startColumn: callerB.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });
        const callerCInstance = await seedCodePlace({
            fileName: callerC.fileName,
            startLine: callerC.lineNumber,
            startColumn: callerC.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });

        await seedPath({
            nodeId: query1Instance.id,
            path: `${query1Instance.id}`,
        });
        await seedPath({
            nodeId: callerAInstance.id,
            path: `${query1Instance.id}.${callerAInstance.id}`,
        });
        await seedPath({
            nodeId: callerBInstance.id,
            path: `${query1Instance.id}.${callerAInstance.id}.${callerBInstance.id}`,
        });
        await seedPath({
            nodeId: callerCInstance.id,
            path: `${query1Instance.id}.${callerAInstance.id}.${callerBInstance.id}.${callerCInstance.id}`,
        });

        await traceService.saveTraces(release.id, [{
            ...query1,
            measurements: [[0,0]],
            callers: [callerA, callerB, callerC],
        }]);

        const paths = await Path.findAll({ order: [['path', 'ASC']] });

        const mappedPaths = paths.map(({ path }) => path);

        const expectedPath = buildTestPath([
            [query1Instance],
            [query1Instance, callerAInstance],
            [query1Instance, callerAInstance, callerBInstance],
            [query1Instance, callerAInstance, callerBInstance, callerCInstance],
        ]);

        expect(mappedPaths).toEqual(expectedPath);
    });

    it('creates new path', async () => {
        const release = await seedRelease();
        jest.spyOn(sourcesService, 'findStatementEnding').mockResolvedValue({ endColumn: 1, endLine: 1 });

        const query1Instance = await seedCodePlace({
            fileName: query1.fileName,
            startLine: query1.lineNumber,
            startColumn: query1.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });
        const callerAInstance = await seedCodePlace({
            fileName: callerA.fileName,
            startLine: callerA.lineNumber,
            startColumn: callerA.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });
        const callerBInstance = await seedCodePlace({
            fileName: callerB.fileName,
            startLine: callerB.lineNumber,
            startColumn: callerB.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });
        const callerCInstance = await seedCodePlace({
            fileName: callerC.fileName,
            startLine: callerC.lineNumber,
            startColumn: callerC.columnNumber,
            endColumn: 1,
            endLine: 1,
            releaseId: release.id,
        });

        await seedPath({
            nodeId: query1Instance.id,
            path: `${query1Instance.id}`,
        });
        await seedPath({
            nodeId: callerAInstance.id,
            path: `${query1Instance.id}.${callerAInstance.id}`,
        });
        await seedPath({
            nodeId: callerBInstance.id,
            path: `${query1Instance.id}.${callerAInstance.id}.${callerBInstance.id}`,
        });
        await seedPath({
            nodeId: callerCInstance.id,
            path: `${query1Instance.id}.${callerAInstance.id}.${callerBInstance.id}.${callerCInstance.id}`,
        });

        await traceService.saveTraces(release.id, [{
            ...query1,
            measurements: [[0,0]],
            callers: [callerB, callerC],
        }]);

        const paths = await Path.findAll({ order: [['path', 'ASC']] });

        const mappedPaths = paths.map(({ path }) => path);

        const expectedPath = buildTestPath([
            [query1Instance],
            [query1Instance, callerAInstance],
            [query1Instance, callerAInstance, callerBInstance],
            [query1Instance, callerAInstance, callerBInstance, callerCInstance],
            [query1Instance, callerBInstance],
            [query1Instance, callerBInstance, callerCInstance],
        ]);

        expect(mappedPaths).toEqual(expectedPath);
    });
});

async function seedEnvironment(overrides?: Partial<Environment>) {
    return Environment.create({
        ...overrides,
    });
}

async function seedRelease(overrides?: Partial<Release>) {
    return Release.create({
        commit: faker.string.alphanumeric({ length: 6 }),
        status: 'active',
        uploadId: faker.string.alphanumeric({ length: 10 }),
        ...overrides,
    });
}

function getCodePlaceInstance(codePlaceData: TraceLike) {
    return CodePlace.findOne({ where : { fileName: codePlaceData.fileName, startColumn: codePlaceData.columnNumber, startLine: codePlaceData.lineNumber }, rejectOnEmpty: true  })
}

function buildTestPath(paths: CodePlace[][]) {
    return paths.map(path => path.map(cp => cp.id).join('.'));
}

async function seedCodePlace(overrides?: Partial<CodePlace>) {
    return CodePlace.create({
        type: 'caller',
        status: 'active',
        fileName: faker.system.directoryPath(),
        startColumn: 1,
        endColumn: 1,
        startLine: 1,
        endLine: 1,
        releaseId: overrides?.releaseId || (await seedRelease()).id,
        trackerId: overrides?.trackerId || (await seedTracker()).id,
        ...overrides,
    });
}

async function seedPath(overrides?: Partial<Path>) {
    const nodeId = overrides?.nodeId || overrides?.path?.split('.')[0] || (await seedCodePlace()).id;
    return Path.create({
        nodeId,
        path: `${nodeId}`,
        ...overrides,
    })
}

async function seedTracker(overrides?: Partial<Tracker>) {
    return Tracker.create({
        name: faker.commerce.department(),
        ...overrides,
    });
}