import { sequelize } from "@libs/sequelize";

export async function getFile(commit: string, path: string) {
    const [ result ] = await sequelize.query(`SELECT "content" FROM "files" WHERE "commit" = ${commit} AND "path" = ${path}`);

    return (result[0] as any).content;
}