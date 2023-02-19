import { sequelize } from "@libs/sequelize";

export async function getFile(releaseId: number, path: string) {
    const [ result ] = await sequelize.query(`SELECT "content" FROM "files" WHERE "releaseId" = ${releaseId} AND "path" = '${path}'`, { logging: true });

    return (result[0] as any)?.content;
}