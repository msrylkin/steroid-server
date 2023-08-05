import { getConnection, getRepository } from "typeorm";
import { TypeormUser } from "./User";

export async function sleep(ms: number) {
    await getConnection().query(`SELECT pg_sleep(${ms})`);
}

export async function rawQuery() {
    const query = 'SELECT * FROM "users" WHERE "id" = $1';

    await getConnection().query(query, [1]);
}

export async function findEntity() {
    const userRepo = getRepository(TypeormUser);

    await userRepo.findOne({
        where: {
            id: 1,
        },
    });
}