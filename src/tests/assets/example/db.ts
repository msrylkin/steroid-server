import { createConnection } from "typeorm";
import { TypeormUser } from "./User";

export async function connectToDb() {
    await createConnection({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'osome-test',
        username: 'user',
        password: 'password',
        entities: [ TypeormUser ],
    });
}