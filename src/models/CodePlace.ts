import { Association, Model } from "@sequelize/core";
import { Release } from "./Release";
import { Tracker } from "./Tracker";
import { sequelize } from '@libs/sequelize';
import { DataTypes } from "@sequelize/core";

export class CodePlace extends Model {
    id: number;
    releaseId: number;
    trackerId: number;

    fileName: string;
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
    status: string;
    executionTime: number;
    hitCount: number;

    release?: Release;
    tracker?: Tracker;

    static release: Association;
    static tracker: Association;

    static associate() {
        this.release = CodePlace.belongsTo(Release, { foreignKey: 'releaseId' });
        this.tracker = CodePlace.belongsTo(Tracker, { foreignKey: 'trackerId' });
    }
}

CodePlace.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    trackerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fileName: {
        type: DataTypes.STRING
    },
    startLine: {
        type: DataTypes.INTEGER,
    },
    endLine: {
        type: DataTypes.INTEGER,
    },
    startColumn: {
        type: DataTypes.INTEGER,
    },
    endColumn: {
        type: DataTypes.INTEGER,
    },
    status: {
        type: DataTypes.STRING,
    },
    type: {
        type: DataTypes.STRING,
    },
    executionTime: {
        type: DataTypes.INTEGER,
    },
    hitCount: {
        type: DataTypes.INTEGER,
    },
    releaseId: {
        type: DataTypes.INTEGER,
    },
}, { sequelize, tableName: 'codePlace', name: { plural: 'codePlaces', singular: 'codePlace' } });