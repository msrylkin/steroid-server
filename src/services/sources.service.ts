import { Environment } from "src/models";
import * as fs from 'fs';
import * as path from 'path';
import { parse, simpleTraverse, AST_NODE_TYPES, TSESTree } from '@typescript-eslint/typescript-estree';

const sourcesRoootPath = '/Users/maxmax/steroid';
const code = 
`import { Entity, PrimaryGeneratedColumn, Column, createConnection, Connection, getRepository, getConnection } from "typeorm";
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
`;
const code2 = 
`import { getConnection, getRepository } from "typeorm";
import { TypeormUser } from "./User";

export async function sleep(ms: number) {
    await getConnection().query(\`SELECT pg_sleep(\${ms})\`);
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
}`

interface FindStatementParams {
    commit: string;
    env: Environment;
    fileName: string;
    lineNumber: number;
    columnNumber: number;
}

export async function findStatementEnding({ commit, env, fileName, lineNumber, columnNumber }: FindStatementParams) {
    const file = fs.readFileSync(path.join(sourcesRoootPath, fileName));

    if (!file) {
        // console.log('no file')
        return;
    }
    // console.log('here123')
    const ast = parse((fileName.includes('services') ? code2 : code) || file.toString('utf-8'), {
        loc: true,
        range: true,
    });

    let endLine = null;
    let endColumn = null;

    simpleTraverse(ast, {
        enter: (node) => {
            // if (node.loc.start.line >= 6 && node.loc.start.line <= 8) {
                // console.log('node', node)
            // }

            if (node.loc.start.line === lineNumber) {
                console.log('noex', node)
            }

            if (
                node.loc.start.line === lineNumber
                && node.loc.start.column === columnNumber - 1
                && node.type === AST_NODE_TYPES.ExpressionStatement
            ) {
                console.log('here333')
                const typedNode = node as TSESTree.ExpressionStatement;
                // console.log('node', typedNode.expression)
                endLine = typedNode.loc.end.line;
                endColumn = typedNode.loc.end.column;
            }

            if (
                node.loc.start.line === lineNumber - 1
                && node.loc.start.column === columnNumber - 1
                // && node.type === AST_NODE_TYPES.ExpressionStatement
            ) {
                const typedNode = node as TSESTree.ExpressionStatement;
                // if (lineNumber === 6 && columnNumber === 5) {
                //     console.log(typedNode)
                // }
                // console.log('node', typedNode.expression)
                // endLine = typedNode.loc.end.line;
                // endColumn = typedNode.loc.end.column;
            }
        }
    });

    if (endColumn !== null && endLine !== null) {
        return {
            endColumn,
            endLine,
        };
    } else {
        console.log('not found', fileName, lineNumber, columnNumber)
    }
    // console.log('ast', ast)
    // ast.body.forEach(elem => {
    //     console.log('elem', elem)
    //     if (elem.loc.start.line === lineNumber && elem.loc.start.column === columnNumber) {
    //         console.log(elem);
    //     }
    // })
}