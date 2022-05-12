import { Model, DataTypes, Association } from "sequelize";
import { sequelize } from "@libs/sequelize";
import { Measurement } from "./Measurement";
import { CodePlace } from "./CodePlace";

export class Tracker extends Model {
    id: number;
    name: string;

    measurements?: Measurement[];
    codePlaces?: CodePlace[];

    static measurements: Association;
    static codePlaces: Association;

    static associate() {
        this.measurements = this.hasMany(Measurement, { foreignKey: 'trackerId' });
        this.codePlaces = this.hasMany(CodePlace, { foreignKey: 'trackerId' });
    }
}

Tracker.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
}, { sequelize, timestamps: true, tableName: 'trackers', name: { singular: 'tracker', plural: 'traces' } });