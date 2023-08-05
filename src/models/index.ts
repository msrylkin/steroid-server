import { Client } from "./Client";
import { Environment } from "./Environment";
import { Measurement } from "./Measurement";
// import { Trace } from "./Trace";
import { CodePlace } from './CodePlace';
import { Release } from './Release';
import { Tracker } from './Tracker';
import { Path } from './Path';

function initAssociations() {
    Client.associate();
    Environment.associate();
    Measurement.associate();
    CodePlace.associate();
    Release.associate();
    Tracker.associate();
    // Path.associate();
    // Trace.associate();
}

initAssociations();

export {
    Client,
    Environment,
    Measurement,
    Release,
    // Trace
}
