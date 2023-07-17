import { Sequelize } from "@sequelize/core";

export function getSequlize() {
    return new Sequelize({
        dialect: 'postgres',
        host: 'localhost',
        port: 6543,
        database: 'steroid2',
        username: 'user',
        password: 'password',
        pool: {
            idle: 1000,
            max: 100,
            acquire: 10000,
        },
    });
}

export const sequelize = getSequlize();
