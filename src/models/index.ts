import { Client } from "./Client";
import { Environment } from "./Environment";
import { Measurement } from "./Measurement";
// import { Trace } from "./Trace";
import { CodePlace } from './CodePlace';
import { Release } from './Release';
import { Tracker } from './Tracker';

function initAssociations() {
    Client.associate();
    Environment.associate();
    Measurement.associate();
    CodePlace.associate();
    Release.associate();
    Tracker.associate();
    // Trace.associate();
}

initAssociations();

export {
    Client,
    Environment,
    Measurement,
    // Trace
}
