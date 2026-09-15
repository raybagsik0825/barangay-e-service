import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getBarangayDb } from "@/lib/mongodb";
import { authenticate } from "@/lib/auth";

// GET: stream a stored file back from GridFS (cloud) for a document record
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const auth = authenticate(request);
  if (auth instanceof NextResponse) return auth;

  const barangay = new URL(request.url).pathname.match(/\/api\/([a-z0-9-]+)\/documents/)?.[1];
  if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

  const db = await getBarangayDb(barangay);

  const doc = await db.collection("documents").findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  if (!doc.is_public && !["admin", "staff"].includes(auth.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const bucket = new (await import("mongodb")).GridFSBucket(db, { bucketName: "uploads" });
  const downloadStream = bucket.openDownloadStream(new ObjectId(doc.file_id));

  const webStream = await (await import("stream")).Readable.toWeb(downloadStream);

  return new Response(webStream as unknown as ReadableStream, {
    status: 200,
    headers: {
      "Content-Type": doc.mime_type || "application/octet-stream",
      "Content-Length": String(doc.file_size || 0),
      "Content-Disposition": `inline; filename="${doc.file_name}"`,
    },
  });
}

// DELETE: remove the document record and its GridFS chunks
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const auth = authenticate(request);
  if (auth instanceof NextResponse) return auth;

  const barangay = new URL(request.url).pathname.match(/\/api\/([a-z0-9-]+)\/documents/)?.[1];
  if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

  const db = await getBarangayDb(barangay);
  const doc = await db.collection("documents").findOne({ _id: new ObjectId(params.id) });
  if (!doc) return NextResponse.json({ error: "Document not found" }, { status: 404 });

  if (doc.file_id) {
    const bucket = new (await import("mongodb")).GridFSBucket(db, { bucketName: "uploads" });
    await bucket.delete(new ObjectId(doc.file_id));
  }

  await db.collection("documents").deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ deleted: true });
}