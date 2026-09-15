import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import type { Filter, Document } from "mongodb";
import { getCollection } from "./mongodb";
import { authenticate } from "./auth";

// ---------- Types ----------------------------------------------------------

export interface CrudOptions {
  /** Collection name (e.g. "announcements") */
  collection: string;
  /** Fields to support $text or regex search */
  searchable?: string[];
  /** Fields that can be used in ?status=X style filtering */
  filterable?: string[];
  /** Fields that can be used in ?sort=X or ?sort=-X */
  sortable?: string[];
  /** Validate body before insert/update */
  validate?: (body: unknown) => string | null;
}

interface ListQuery {
  search?: string;
  sort?: string;
  page: number;
  limit: number;
  [key: string]: string | number | undefined;
}

// ---------- Helpers --------------------------------------------------------

function parseQuery(request: Request): ListQuery {
  const url = new URL(request.url);
  const extra: Record<string, string> = {};
  for (const [k, v] of url.searchParams.entries()) {
    if (!["search", "sort", "page", "limit"].includes(k)) extra[k] = v;
  }
  return {
    search: url.searchParams.get("search") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    page: Math.max(1, Number(url.searchParams.get("page") ?? "1") || 1),
    limit: Math.min(500, Math.max(1, Number(url.searchParams.get("limit") ?? "50") || 50)),
    ...extra,
  };
}

function buildFilter(query: ListQuery, opts: CrudOptions): Filter<Document> {
  const filter: Filter<Document> = {};

  // Status / explicit filterable params
  if (opts.filterable) {
    for (const field of opts.filterable) {
      const val = query[field];
      if (val) filter[field] = val;
    }
  }

  // Search
  if (query.search && opts.searchable?.length) {
    filter.$or = opts.searchable.map((f) => ({
      [f]: { $regex: query.search, $options: "i" },
    }));
  }

  return filter;
}

function buildSort(sortStr?: string, defaults: Record<string, 1 | -1> = { created_at: -1 }) {
  if (!sortStr) return defaults;
  const sort: Record<string, 1 | -1> = {};
  for (const part of sortStr.split(",")) {
    const desc = part.startsWith("-");
    const field = desc ? part.slice(1) : part;
    sort[field] = desc ? -1 : 1;
  }
  return sort;
}

// ---------- List + Create --------------------------------------------------

export function createListRoute(opts: CrudOptions) {
  const { collection, validate } = opts;

  async function GET(request: Request) {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;

    const barangay = extractBarangay(request.url);
    if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

    const query = parseQuery(request);
    const filter = buildFilter(query, opts);
    const sort  = buildSort(query.sort);

    const col = await getCollection(barangay, collection);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      col.find(filter).sort(sort).skip(skip).limit(query.limit).toArray(),
      col.countDocuments(filter),
    ]);

    return NextResponse.json({
      items,
      total,
      page: query.page,
      pages: Math.ceil(total / query.limit),
    });
  }

  async function POST(request: Request) {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;

    const barangay = extractBarangay(request.url);
    if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

    const body = await request.json();

    if (validate) {
      const error = validate(body);
      if (error) return NextResponse.json({ error }, { status: 400 });
    }

    const now = new Date().toISOString();
    const doc = { ...body, created_at: now, updated_at: now };

    const col = await getCollection(barangay, collection);
    const result = await col.insertOne(doc);

    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  }

  return { GET, POST };
}

// ---------- Get + Update + Delete ------------------------------------------

export function createDetailRoute(opts: CrudOptions) {
  const { collection, validate } = opts;

  async function GET(request: Request, { params }: { params: { id: string } }) {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;

    const barangay = extractBarangay(request.url);
    if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

    const col = await getCollection(barangay, collection);
    const doc = await col.findOne({ _id: new ObjectId(params.id) });

    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(doc);
  }

  async function PUT(request: Request, { params }: { params: { id: string } }) {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;

    const barangay = extractBarangay(request.url);
    if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

    const body = await request.json();

    if (validate) {
      const error = validate(body);
      if (error) return NextResponse.json({ error }, { status: 400 });
    }

    const col = await getCollection(barangay, collection);
    const { _id, created_at, ...updates } = body;
    updates.updated_at = new Date().toISOString();

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(result);
  }

  async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const auth = authenticate(request);
    if (auth instanceof NextResponse) return auth;

    const barangay = extractBarangay(request.url);
    if (!barangay) return NextResponse.json({ error: "Invalid barangay" }, { status: 400 });

    const col = await getCollection(barangay, collection);
    const result = await col.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ deleted: true });
  }

  return { GET, PUT, DELETE };
}

// ---------- Utility --------------------------------------------------------

function extractBarangay(url: string): string | null {
  // URL like /api/tanza-1/announcements  →  barangay = "tanza-1"
  const match = url.match(/\/api\/([a-z0-9-]+)\//);
  return match?.[1] ?? null;
}