import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/mongodb";
import { hashPassword } from "@/lib/auth";

// One-time bootstrap: creates the initial admin user.
// Safe-guards: must have ENABLE_BOOTSTRAP=true in env AND the users collection
// must be empty. Self-disables once any user exists, so turn the env flag off
// after your first login.
export async function POST(request: Request) {
  if (process.env.ENABLE_BOOTSTRAP !== "true") {
    return NextResponse.json({ error: "Bootstrap is disabled" }, { status: 403 });
  }

  const { username, password, fullName, role } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "username and password required" }, { status: 400 });
  }

  const db = await getAdminDb();
  const count = await db.collection("users").countDocuments();
  if (count > 0) {
    return NextResponse.json(
      { error: "Admin already exists. Turn off ENABLE_BOOTSTRAP." },
      { status: 409 }
    );
  }

  const user = {
    username,
    full_name: fullName || "System Administrator",
    role: role === "staff" || role === "lupon" ? role : "admin",
    status: "active",
    password_hash: await hashPassword(password),
    barangays: null,
    created_at: new Date().toISOString(),
  };

  await db.collection("users").insertOne(user);
  return NextResponse.json(
    { ok: true, message: "Initial admin created. Turn off ENABLE_BOOTSTRAP in Vercel now." },
    { status: 201 }
  );
}