import { sequelize } from '@libs/sequelize';
import { DataTypes, Model, Association } from 'sequelize';
import { Trace } from './Trace';

export class Measurement extends Model {
    id: number;
    traceId: number;

    seconds: number;
    nanoseconds: number;

    static trace: Association;

    trace?: Trace;

    static associate() {
        Measurement.belongsTo(Trace, { foreignKey: 'traceId' });
    }
}

Measurement.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        traceId: {
            type: DataTypes.INTEGER
        },
        seconds: {
            type: DataTypes.INTEGER,
        },
        nanoseconds: {
            type: DataTypes.INTEGER,
        },
    }, {
        sequelize,
        tableName: 'measurements',
        name: {
            singular: 'measurement',
            plural: 'measurements'
        }
    }
);