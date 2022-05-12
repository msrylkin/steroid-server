import { Association, Model } from "sequelize";
import { Release } from "./Release";
import { Tracker } from "./Tracker";
import { sequelize } from '@libs/sequelize';
import { DataTypes } from 'sequelize';

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
}, { sequelize, tableName: 'codePlace', name: { plural: 'codePlaces', singular: 'codePlace' } });