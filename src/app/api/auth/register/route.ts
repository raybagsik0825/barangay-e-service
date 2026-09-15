import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/mongodb";
import { hashPassword, requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { username, email, password, fullName, role, barangays } = await request.json();

  if (!username || !password || !fullName || !role) {
    return NextResponse.json(
      { error: "username, password, fullName, role required" },
      { status: 400 }
    );
  }

  if (!["admin", "staff", "lupon", "pnp_authorized"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const db = await getAdminDb();

  const exists = await db.collection("users").findOne({ username });
  if (exists) return NextResponse.json({ error: "Username already taken" }, { status: 409 });

  const user = {
    username,
    email: email || null,
    password_hash: await hashPassword(password),
    full_name: fullName,
    role,
    status: "active",
    barangays: barangays || null, // null = all barangays; else array of slugs
    created_by: auth.sub,
    created_at: new Date().toISOString(),
  };

  const result = await db.collection("users").insertOne(user);
  return NextResponse.json(
    { _id: result.insertedId, username, fullName, role },
    { status: 201 }
  );
}