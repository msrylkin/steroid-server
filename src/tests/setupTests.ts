import { Environment } from "src/models/Environment";
import { Client } from "src/models/Client";
import { CodePlace } from "src/models/CodePlace";
import { Measurement } from "src/models/Measurement";
import { Path } from "src/models/Path";
import { Release } from "src/models/Release";
import { Tracker } from "src/models/Tracker";

beforeEach(async () => {
    await cleanTables();
});

afterEach(() => {
    // jest.resetAllMocks();
});

async function cleanTables() {
    await Path.truncate({ cascade: true });
    await Measurement.truncate({ cascade: true });
    await CodePlace.truncate({ cascade: true });
    await Release.truncate({ cascade: true });
    await Tracker.truncate({ cascade: true });
}