import { CodePlace } from "src/models/CodePlace";

async function example(params: { userId: number }) {
    const variable = params.userId;
    const id = new Date();
    const outer = {};

    const result = await CodePlace.findOne({
        where: {
            asd: '123',
            no: outer,
            zxc: {
                ...(outer),
                a: 'a',
            },
            refByOtherName: variable,
            id,
        },
    });

    const asd = new Date();

    return result;
}