import { Environment } from "src/models";

export function getEnvironemnt(token: string) {
    return Environment.findOne({
        where: {
            token: token || null,
        },
    });
}