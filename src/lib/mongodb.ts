import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_ADMIN = process.env.MONGODB_DB_ADMIN || "admin";

let cachedClient: MongoClient | null = null;

// ---- Connection -----------------------------------------------------------

export async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  cachedClient = await MongoClient.connect(MONGODB_URI);
  return cachedClient;
}

export async function getAdminDb(): Promise<Db> {
  const client = await getClient();
  return client.db(MONGODB_DB_ADMIN);
}

// Resolve a barangay slug to a per-barangay database instance.
// Database name is derived from the slug:  "tanza-1" → "brgy_tanza_1"
export async function getBarangayDb(slug: string): Promise<Db> {
  const client = await getClient();
  const dbName = `brgy_${slug.replace(/-/g, "_")}`;
  return client.db(dbName);
}

// Generic helper: returns the collection from a barangay database
export async function getCollection(barangaySlug: string, name: string) {
  const db = await getBarangayDb(barangaySlug);
  return db.collection(name);
}