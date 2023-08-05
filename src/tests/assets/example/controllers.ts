import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, getRepository, getConnection } from "typeorm";
import { findEntity, rawQuery, sleep } from "./services";
import { TypeormUser } from "./User";

export async function exampleController(req, res, next) {
    await findEntity();
    await rawQuery();
    await sleep(2);

    await composite();
    await compositeBad();

    res.json({});
}

async function composite() {
    await findEntity();
    await rawQuery();
    await sleep(1);
}

async function compositeBad() {
    await findEntity();
    await sleep(1);
    await sleep(2);
    await sleep(2);
}