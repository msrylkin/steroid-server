import { sequelize } from "@libs/sequelize";
import { DataTypes, Model } from "sequelize";

export class Frame extends Model {
    id: number;
    traceId: number;
}

Frame.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    traceId: {
        type: DataTypes.INTEGER,
    },
}, { sequelize })
