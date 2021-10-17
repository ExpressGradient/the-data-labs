import { query, Client } from "faunadb";

const client = new Client({
    secret: process.env.FAUNA_SECRET,
    domain: "db.fauna.com",
    port: 443,
    scheme: "https",
});

export const q = query;

export default client;
