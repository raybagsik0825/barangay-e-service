import { NextResponse } from "next/server";
import { getBarangayDb } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";

// Multipart upload: stores the file in MongoDB GridFS (cloud object storage),
// then returns the file_id for linking into the documents collection.
export async function POST(request: Request) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const barangay = new URL(request.url).pathname.match(/\/api\/([a-z0-9-]+)\/documents/)?.[1];
  if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

  const db = await getBarangayDb(barangay);
  const bucket = new (await import("mongodb")).GridFSBucket(db, {
    bucketName: "uploads",
  });

  const form = await request.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "file is required" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fs = await import("stream/promises");

  const uploadStream = bucket.openUploadStream(file.name, {
    contentType: file.type || "application/octet-stream",
    metadata: {
      uploaded_by: auth.sub,
      barangay,
      uploaded_at: new Date().toISOString(),
    },
  });

  uploadStream.end(buffer);
  await fs.finished(uploadStream);

  const stored = uploadStream.id as unknown as string;

  return NextResponse.json(
    {
      file_id: stored,
      file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      message: "File stored in cloud (GridFS). Call POST /api/<barangay>/documents to link it.",
    },
    { status: 201 }
  );
}