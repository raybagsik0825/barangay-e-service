import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";
import { barangays } from "@/lib/barangays";

// One-time provisioning: creates the superadmin + one staff account per
// barangay. Protected by SEED_SECRET — remove the env var after use.
//
//   POST /api/auth/seed-accounts
//   Headers: { "x-seed-secret": "<SEED_SECRET>" }
//   Body (optional): { "password": "custom-default-password" }
export async function POST(request: Request) {
  const secret = process.env.SEED_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Seeding is disabled" }, { status: 403 });
  }
  if (request.headers.get("x-seed-secret") !== secret) {
    return NextResponse.json({ error: "Invalid seed secret" }, { status: 403 });
  }

  let password = "badboy666";
  try {
    const body = await request.json();
    if (typeof body.password === "string" && body.password.length >= 8) {
      password = body.password;
    }
  } catch {
    /* empty body is fine — use default */
  }

  const db = await getAdminDb();
  const col = db.collection("users");
  const now = new Date().toISOString();
  const password_hash = await hashPassword(password);

  const created: string[] = [];
  const skipped: string[] = [];

  async function ensureUser(doc: {
    username: string;
    full_name: string;
    role: string;
    barangays: string[] | null;
  }) {
    const exists = await col.findOne({ username: doc.username });
    if (exists) {
      skipped.push(doc.username);
      return;
    }
    await col.insertOne({
      ...doc,
      email: null,
      status: "active",
      password_hash,
      created_at: now,
    });
    created.push(doc.username);
  }

  // 1) Super admin — manages all barangays
  await ensureUser({
    username: "superadmin",
    full_name: "Super Administrator",
    role: "admin",
    barangays: null,
  });

  // 2) One staff account per barangay (scoped to its own database)
  for (const b of barangays) {
    await ensureUser({
      username: b.slug,
      full_name: `${b.name} Staff`,
      role: "staff",
      barangays: [b.slug],
    });
  }

  return NextResponse.json(
    {
      ok: true,
      created,
      skipped,
      message: "Accounts ready. Remove SEED_SECRET from Vercel now.",
    },
    { status: 201 }
  );
}
