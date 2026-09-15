import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/mongodb";
import { verifyPassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: "username and password required" }, { status: 400 });
  }

  const db = await getAdminDb();
  const user = await db.collection("users").findOne({ username });

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  if (user.status !== "active") {
    return NextResponse.json({ error: "Account is disabled" }, { status: 403 });
  }

  const token = signToken({ _id: user._id, username: user.username, fullName: user.full_name, role: user.role });

  await db.collection("users").updateOne(
    { _id: user._id },
    { $set: { last_login_at: new Date().toISOString() } }
  );

  return NextResponse.json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      fullName: user.full_name,
      role: user.role,
    },
  });
}