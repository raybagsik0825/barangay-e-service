// Seed script — creates the 19 barangay databases with collections + indexes,
// plus the admin database with a default admin user.
//
// Usage:
//   MONGODB_URI="mongodb+srv://..." node database/seed.js

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const ADMIN_DB = process.env.MONGODB_DB_ADMIN || "barangay_auth";

const BARANGAYS = [
  { slug: "binuangan",        name: "Binuangan" },
  { slug: "nbbs-kaunlaran",   name: "NBBS Kaunlaran" },
  { slug: "nbbs-dagat",       name: "NBBS Dagat-dagatan" },
  { slug: "nbbs-proper",      name: "NBBS Proper" },
  { slug: "san-jose",         name: "San Jose" },
  { slug: "san-roque",        name: "San Roque" },
  { slug: "sipac-almacen",    name: "Sipac-Almacen" },
  { slug: "tangos-north",     name: "Tangos North" },
  { slug: "tangos-south",     name: "Tangos South" },
  { slug: "tanza-1",          name: "Tanza 1" },
  { slug: "tanza-2",          name: "Tanza 2" },
  { slug: "navotas-south",    name: "Navotas South District" },
  { slug: "bagumbayan-north", name: "Bagumbayan North" },
  { slug: "daanghari",        name: "Daanghari" },
  { slug: "navotas-west",     name: "Navotas West" },
  { slug: "navotas-east",     name: "Navotas East" },
  { slug: "hulong-duhat",     name: "Hulong Duhat" },
  { slug: "dampalit",         name: "Dampalit" },
  { slug: "salambao",         name: "Salambao" },
];

const COLLECTIONS_WITH_INDEXES = [
  { name: "announcements",   indexes: [{ key: { is_published: 1 }, name: "idx_published" }, { key: { published_at: -1 } }] },
  { name: "residents",       indexes: [{ key: { last_name: 1 } }, { key: { status: 1 } }, { key: { purok: 1 } }] },
  { name: "cases",           indexes: [{ key: { case_reference: 1 }, unique: true }, { key: { status: 1 } }, { key: { filed_date: -1 } }] },
  { name: "case_parties",    indexes: [{ key: { case_id: 1 } }, { key: { resident_id: 1 } }] },
  { name: "hearings",        indexes: [{ key: { case_id: 1, scheduled_date: 1 } }, { key: { status: 1 } }] },
  { name: "hearing_panel",   indexes: [{ key: { hearing_id: 1 } }] },
  { name: "lupon_members",   indexes: [{ key: { status: 1 } }] },
  { name: "lupon_panels",    indexes: [{ key: { created_at: -1 } }] },
  { name: "crime_reports",   indexes: [{ key: { status: 1, severity: 1 } }, { key: { incident_date: -1 } }] },
  { name: "wanted_persons",  indexes: [{ key: { status: 1 } }, { key: { last_name: 1 } }] },
  { name: "case_suspects",   indexes: [{ key: { case_id: 1 } }] },
  { name: "lost_found_items",indexes: [{ key: { type: 1, status: 1 } }, { key: { date_lost_found: -1 } }] },
  { name: "documents",       indexes: [{ key: { entity_type: 1, entity_id: 1 } }, { key: { doc_type: 1 } }] },
  { name: "document_requests", indexes: [{ key: { status: 1 } }, { key: { requested_at: -1 } }] },
  { name: "document_request_items", indexes: [{ key: { request_id: 1 } }] },
  { name: "settings",        indexes: [{ key: { key: 1 }, unique: true }] },
];

async function main() {
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  console.log("Connected to MongoDB.");

  // 1) Admin database — users collection
  const adminDb = client.db(ADMIN_DB);
  await adminDb.collection("users").createIndex({ username: 1 }, { unique: true });
  console.log(`[${ADMIN_DB}] users index ready`);

  const existing = await adminDb.collection("users").countDocuments();
  if (existing === 0) {
    const bcrypt = (await import("bcryptjs")).default;
    const passwordHash = await bcrypt.hash("Admin123!@#", 12);
    await adminDb.collection("users").insertOne({
      username: "admin",
      full_name: "System Administrator",
      role: "admin",
      status: "active",
      password_hash: passwordHash,
      barangays: null,
      created_at: new Date().toISOString(),
    });
    console.log(`[${ADMIN_DB}] default admin created (admin / Admin123!@#)`);
  }

  // 2) One database per barangay + collections + indexes
  for (const b of BARANGAYS) {
    const dbName = `brgy_${b.slug.replace(/-/g, "_")}`;
    const db = client.db(dbName);
    for (const c of COLLECTIONS_WITH_INDEXES) {
      const col = db.collection(c.name);
      for (const idx of c.indexes) {
        await col.createIndex(idx.key, idx.name ? { name: idx.name, unique: !!idx.unique } : { unique: !!idx.unique });
      }
    }
    // GridFS bucket for cloud document storage (used by /documents/upload)
    await db.createCollection("uploads.files", {});
    await db.createCollection("uploads.chunks", {});
    await db.collection("settings").updateOne(
      { key: "barangay_info" },
      { $set: { value: { name: b.name, slug: b.slug, dbName }, updated_at: new Date().toISOString() } },
      { upsert: true }
    );
    console.log(`[${dbName}] ${b.name} ready (${COLLECTIONS_WITH_INDEXES.length} collections)`);
  }

  console.log("\nDone. All 19 barangay databases are seeded.");
  await client.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});