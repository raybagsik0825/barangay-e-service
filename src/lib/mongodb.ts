import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;

function getUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local (see .env.example).");
  }
  return uri;
}

// ---- Connection -----------------------------------------------------------

export async function getClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  cachedClient = await MongoClient.connect(getUri());
  return cachedClient;
}

export async function getAdminDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB_ADMIN || "admin");
}

// Resolve a barangay slug to a per-barangay database instance:
//   "tanza-1" → "brgy_tanza_1"
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