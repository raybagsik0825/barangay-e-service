import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const SALT_ROUNDS = 12;

export interface AuthUser {
  _id: ObjectId;
  username: string;
  fullName: string;
  role: string;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

// ---- Password helpers -----------------------------------------------------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ---- JWT helpers -----------------------------------------------------------

export function signToken(user: AuthUser): string {
  const payload: JwtPayload = {
    sub: user._id.toString(),
    username: user.username,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function extractToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookie = request.headers.get("cookie");
  const match = cookie?.match(/token=([^;]+)/);
  return match?.[1] ?? null;
}

export function authenticate(request: Request): JwtPayload | NextResponse {
  const token = extractToken(request);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  return payload;
}

// Ensure the caller is an admin or staff (not a plain lupon/pnp user)
export function requireAdmin(request: Request): JwtPayload | NextResponse {
  const auth = authenticate(request);
  if (auth instanceof NextResponse) return auth;
  if (!["admin", "staff"].includes(auth.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return auth;
}