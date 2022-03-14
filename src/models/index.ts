import { Client } from "./Client";
import { Environment } from "./Environment";
import { Measurement } from "./Measurement";
import { Trace } from "./Trace";

function initAssociations() {
    Client.associate();
    Environment.associate();
    Measurement.associate();
    Trace.associate();
}

initAssociations();

export {
    Client,
    Environment,
    Measurement,
    Trace
}
