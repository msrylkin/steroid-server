import { Client } from "src/models";

export async function getClientByApiKey(token: string) {
    return Client.findOne();
}