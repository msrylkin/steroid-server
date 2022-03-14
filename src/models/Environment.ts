import { sequelize } from '@libs/sequelize';
import { Association, Model } from 'sequelize';
import { DataTypes } from 'sequelize';
import { Trace } from '.';
import { Client } from './Client';

export class Environment extends Model {
    id: number;
    clientId: number;

    commit: string;
    name: string;
    token: string; 

    client?: Client;
    traces?: Trace[];

    static client: Association;
    static traces: Association;

    static associate() {
        this.client = Environment.belongsTo(Client, { foreignKey: 'clientId' });
        this.traces = Environment.hasMany(Trace, { foreignKey: 'environmentId' });
    }
}

Environment.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    clientId: {
        type: DataTypes.INTEGER
    },
    commit: {
        type: DataTypes.STRING,
    },
}, { sequelize, tableName: 'environments', name: { singular: 'environment', plural: 'environments' } });
