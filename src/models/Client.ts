import { sequelize } from '@libs/sequelize';
import { Model, DataTypes, Association } from "@sequelize/core";
import { Environment } from './Environment';

export class Client extends Model {
    id: number;
    token: string;

    static environments: Association[];

    static associate() {
        Client.hasMany(Environment, { foreignKey: 'clientId' });
    }
}

Client.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    token: {
        type: DataTypes.STRING
    }
}, { sequelize, timestamps: true, tableName: 'clients', name: { plural: 'clients', singular: 'client' } })