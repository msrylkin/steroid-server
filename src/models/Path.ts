import { Association, DataTypes, Model } from "sequelize";
import { sequelize } from '@libs/sequelize';
import { CodePlace } from "./CodePlace";

export class Path extends Model {
    nodeId!: number;
    path!: string;

    static codePlace: Association;

    codePlace?: CodePlace;

    static associate() {

    }
}

Path.init({
    nodeId: {
        type: DataTypes.INTEGER,
    },
    path: {
        primaryKey: true,
        type: DataTypes.STRING,
    },
}, { sequelize, timestamps: true, tableName: 'paths', name: { plural: 'paths', singular: 'path' } });