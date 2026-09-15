import { NextResponse } from "next/server";
import { getBarangayDb } from "@/lib/mongodb";
import { authenticate } from "@/lib/auth";

// List document metadata for a barangay (optionally filtered by entity/doc_type)
export async function GET(request: Request) {
  const auth = authenticate(request);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const barangay = url.pathname.match(/\/api\/([a-z0-9-]+)\/documents/)?.[1];
  if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

  const db = await getBarangayDb(barangay);
  const col = db.collection("documents");

  const filter: Record<string, unknown> = {};
  const entityType = url.searchParams.get("entity_type");
  const entityId   = url.searchParams.get("entity_id");
  const docType    = url.searchParams.get("doc_type");
  if (entityType) filter.entity_type = entityType;
  if (entityId)   filter.entity_id = entityId;
  if (docType)    filter.doc_type = docType;

  const items = await col.find(filter).sort({ uploaded_at: -1 }).limit(200).toArray();
  return NextResponse.json({ items, total: items.length });
}

// Register a file already stored in GridFS as a document record with entity link
export async function POST(request: Request) {
  const auth = authenticate(request);
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const barangay = url.pathname.match(/\/api\/([a-z0-9-]+)\/documents/)?.[1];
  if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

  const body = await request.json();
  if (!body.file_id) return NextResponse.json({ error: "file_id required" }, { status: 400 });

  const db = await getBarangayDb(barangay);
  const doc = {
    file_id: body.file_id,
    entity_type: body.entity_type || null,
    entity_id: body.entity_id || null,
    doc_type: body.doc_type || "misc",
    title: body.title || "Untitled document",
    description: body.description || null,
    file_name: body.file_name,
    mime_type: body.mime_type,
    file_size: body.file_size,
    version: 1,
    is_public: body.is_public ?? false,
    uploaded_by: auth.sub,
    uploaded_at: new Date().toISOString(),
  };

  const result = await db.collection("documents").insertOne(doc);
  return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}