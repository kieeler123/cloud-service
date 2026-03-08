import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}

const uri = requireEnv("MONGODB_URI");
const dbName = requireEnv("MONGODB_DB");

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (db) {
    return db;
  }

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }

  const connectedDb = client.db(dbName);
  db = connectedDb;

  return connectedDb;
}
