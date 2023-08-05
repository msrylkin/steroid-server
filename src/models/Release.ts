import { sequelize } from '@libs/sequelize';
import { DataTypes, Model, Association } from "sequelize";
import { CodePlace } from './CodePlace';

export class Release extends Model {
    id!: number;
    commit: string;
    status: string;
    uploadId: string;

    createdAt: Date;
    updatedAt: Date;

    codePlaces: CodePlace[];

    static codePlaces: Association;

    static associate() {
        this.codePlaces = Release.hasMany(CodePlace, { foreignKey: 'releaseId', as: 'codePlaces' });
    }
}

Release.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    commit: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    uploadId: {
        type: DataTypes.STRING,
    },
}, { sequelize, tableName: 'releases' });
