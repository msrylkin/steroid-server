import * as pg from 'pg';
import { Sequelize } from "sequelize";

const isAws = !!process.env.STAGE;

export function getSequlize() {
    return new Sequelize({
        dialectModule: pg,
        dialect: 'postgres',
        host: isAws ? 'steroid-db.chnzjncs47wo.us-east-1.rds.amazonaws.com' : 'localhost',
        port: isAws ? 5432 : 6543,
        database: isAws ? 'steroid-db' : 'steroid2',
        username: isAws ? 'steroid' : 'user',
        password: isAws ? 'YXcQwtCS98LX8!3' : 'password',
        pool: {
            idle: 1000,
            max: 100,
            acquire: 10000,
        },
    });
}

export const sequelize = getSequlize();
