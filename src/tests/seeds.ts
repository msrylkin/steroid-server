import { faker } from "@faker-js/faker";
import { CodePlace } from "src/models/CodePlace";
import { Environment } from "src/models/Environment";
import { Path } from "src/models/Path";
import { Release } from "src/models/Release";
import { Tracker } from "src/models/Tracker";

export async function seedCodePlace(overrides?: Partial<CodePlace>) {
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

export async function seedPath(overrides?: Partial<Path>) {
    const nodeId = overrides?.nodeId || overrides?.path?.split('.')[0] || (await seedCodePlace()).id;
    return Path.create({
        nodeId,
        path: `${nodeId}`,
        ...overrides,
    })
}

export async function seedTracker(overrides?: Partial<Tracker>) {
    return Tracker.create({
        name: faker.commerce.department(),
        ...overrides,
    });
}

export async function seedEnvironment(overrides?: Partial<Environment>) {
    return Environment.create({
        ...overrides,
    });
}

export async function seedRelease(overrides?: Partial<Release>) {
    return Release.create({
        commit: faker.string.alphanumeric({ length: 6 }),
        status: 'active',
        uploadId: faker.string.alphanumeric({ length: 10 }),
        ...overrides,
    });
}