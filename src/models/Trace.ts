import { Model, DataTypes, Association } from "sequelize";
import { sequelize } from "@libs/sequelize";
import { Measurement } from "./Measurement";
import { Environment } from ".";
import { CodePlace } from "./CodePlace";

export class Trace extends Model {
    id: number;
    environmentId: number;

    fileName: string;
    lineNumber: number;
    columnNumber: number;
    commit: string;

    createdAt: Date;
    updatedAt: Date;

    measurements?: Measurement[];
    environment?: Environment;

    static measurements: Association;
    static environment: Association;

    static associate() {
        this.measurements = Trace.hasMany(Measurement, { foreignKey: 'traceId' });
        this.environment = Trace.belongsTo(Environment, { foreignKey: 'environmentId' });
    }
}

Trace.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    environmentId: {
        type: DataTypes.INTEGER,
    },
    fileName: {
        type: DataTypes.STRING,
    },
    lineNumber: {
        type: DataTypes.INTEGER,
    },
    columnNumber: {
        type: DataTypes.INTEGER,
    },
    commit: {
        type: DataTypes.STRING,
    }
}, { sequelize, timestamps: true, tableName: 'traces', name: { singular: 'trace', plural: 'traces' } });

// export class Trace extends Model {
//     id: number;
//     name: string;

//     measurements?: Measurement[];
//     codePlaces?: CodePlace[];

//     static measurements: Association;
//     static codePlaces: Association;

//     static associate() {
//         this.measurements = this.hasMany(Measurement, { foreignKey: 'traceId' });
//         this.codePlaces = this.hasMany(CodePlace, { foreignKey: 'traceId' });
//     }
// }

// Trace.init({
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     name: {
//         type: DataTypes.STRING,
//     },
// }, { sequelize, timestamps: true, tableName: 'traces', name: { singular: 'trace', plural: 'traces' } });
