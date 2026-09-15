import { NextResponse } from "next/server";
import { getBarangays } from "@/lib/barangays";

export async function GET() {
  return NextResponse.json({ barangays: getBarangays() });
}