# MongoDB Multi-Tenant Database Plan — Barangay E-Services

**Engine:** MongoDB 7 (Atlas recommended for cloud hosting)
**Backend:** Next.js 14 App Router API routes

---

## 1. Multi-Tenant Architecture

One **barangay_auth** database holds login accounts; every barangay gets its **own database** so
records, files, and settings are fully isolated per barangay.

```
MongoDB Cluster
├── barangay_auth             ← users, permissions, activity_logs (all barangays)
│
├── brgy_binuangan           ← one database PER barangay
├── brgy_nbbs_kaunlaran
├── brgy_nbbs_dagat
├── brgy_nbbs_proper
├── brgy_san_jose
├── brgy_san_roque
├── brgy_sipac_almacen
├── brgy_tangos_north
├── brgy_tangos_south
├── brgy_tanza_1
├── brgy_tanza_2
├── brgy_navotas_south
├── brgy_bagumbayan_north
├── brgy_daanghari
├── brgy_navotas_west
├── brgy_navotas_east
├── brgy_hulong_duhat
├── brgy_dampalit
└── brgy_salambao
```

Routing: `GET /api/:barangay/cases` → `client.db("brgy_" + slug)` → `cases` collection.

---

## 2. Auth Database (`barangay_auth`)

### `users` — admin panel accounts
| Field | Type | Notes |
| --- | --- | --- |
| _id | ObjectId | |
| username | string (unique) | login |
| password_hash | string | bcrypt (12 rounds) |
| full_name | string | |
| email | string | nullable |
| role | string | `admin`, `staff`, `lupon`, `pnp_authorized` |
| status | string | `active`, `inactive`, `locked` |
| barangays | string[] \| null | null = all 19; else allowed slugs |
| last_login_at | date | |
| created_at / updated_at | date | |

### `permissions` — RBAC per module per role

### `activity_logs` — audit trail (user, action, module, entity, JSON diff)

---

## 3. Barangay Database Collections (identical per barangay)

Each collection below exists **inside every barangay database** and backs the matching
navbar function on the portal.

### 3.1 `announcements`
| Field | Type |
| --- | --- |
| title, body | string |
| category | `advisory\|event\|health\|project\|alert` |
| is_pinned, is_published | boolean |
| author_id | ObjectId → barangay_auth.users |
| published_at, expires_at | date |
| created_at, updated_at | date |

### 3.2 `residents` — master person records
Full PH-profile fields: `first_name, middle_name, last_name, alias, sex, birth_date,
civil_status, contact_number, email, house_no, purok, street, zone, blood_type,
occupation, emergency_contact, profile_photo, status, registered_at`.

### 3.3 `cases` — Lupon/complaint dockets
`case_reference (unique), case_type, nature, subject, summary, status
(docketed|for_preliminary|for_hearing|resolved|dismissed|archived), filed_date,
lupon_panel_id`.

### 3.4 `case_parties`
`case_id, resident_id, role (complainant|respondent|witness|guardian)`.

### 3.5 `lupon_panels` & `lupon_members`
Panels + appointed members (position, resolution_no, appointment_date, status).

### 3.6 `hearings`
`case_id, hearing_no, scheduled_date, start_time, end_time, venue, status
(scheduled|held|postponed|cancelled), outcome_notes`.

### 3.7 `hearing_panel`
`hearing_id, lupon_member_id, role (chairman|member|secretary)`.

### 3.8 `crime_reports` — public Safety & Crime Registry
`title, incident_type (theft|robbery|vandalism|disturbance|assault|other),
description, incident_date, location, severity (low|medium|high), status
(active|under_investigation|resolved|closed), reported_by → residents`.

### 3.9 `wanted_persons`
`first_name, middle_name, last_name, alias, sex, birth_date, photo, danger_level,
charges_or_description, last_known_location, status
(wanted|arrested|cleared|deactivated)`.

### 3.10 `case_suspects`
`case_id, wanted_person_id, resident_id, status
(suspect|person_of_interest|cleared|charged)`.

### 3.11 `lost_found_items` — Lost & Found tab
`type (lost|found), item_name, category, description, location, date_lost_found,
status (open|pending_claim|claimed|returned|closed), reported_by, claimant_id,
claimed_at`.

### 3.12 `documents` + GridFS bucket `uploads` — CFA & official files (cloud)
| Field | Type | Notes |
| --- | --- | --- |
| file_id | ObjectId | id in GridFS `uploads` bucket |
| entity_type | string | `case`, `hearing`, `crime_report`, `announcement`, `lost_found_item`, `wanted_person`, `resident` |
| entity_id | string | document row id |
| doc_type | string | `cfa`, `subpoena`, `hearing_log`, `complaint_record`, `settlement`, `certificate`, `photo`, `proof`, `misc` |
| title, description | string | |
| file_name, mime_type, file_size | string/number | |
| is_public | boolean | gates public download |
| uploaded_by | ObjectId → barangay_auth.users | |

The **file bytes themselves live in GridFS** (`uploads.files` + `uploads.chunks`),
which is cloud object storage when the cluster runs on **MongoDB Atlas** — no extra
S3/Cloudinary account needed.

### 3.13 `document_requests` & `document_request_items` — PNP CFA request queue
`request_code (unique), requester_id, requesting_office, purpose, status
(pending|approved|rejected|fulfilled), approved_by, reviewed_at, items[]`.

### 3.14 `settings` — `key` (unique) → `value` (JSON)

---

## 4. API Surface (Next.js App Router)

| Method & Path | Purpose |
| --- | --- |
| `POST /api/auth/login` | Login → JWT |
| `POST /api/auth/register` | Create admin user |
| `GET /api/barangays` | List the 19 barangays |
| `GET/POST /api/:barangay/announcements` | List / create |
| `GET/PUT/DELETE /api/:barangay/announcements/:id` | One |
| `GET/POST /api/:barangay/residents` | List / create |
| `GET/PUT/DELETE /api/:barangay/residents/:id` | One |
| `GET/POST /api/:barangay/cases` | Dockets / create |
| `GET/PUT/DELETE /api/:barangay/cases/:id` | One |
| `GET/POST /api/:barangay/case-parties` | Parties |
| `GET/POST /api/:barangay/hearings` | Schedules / create |
| `GET/PUT/DELETE /api/:barangay/hearings/:id` | One |
| `GET/POST /api/:barangay/crime-reports` | Registry |
| `GET/POST /api/:barangay/wanted-persons` | Wanted posters |
| `GET/POST /api/:barangay/lost-found` | Lost & Found |
| `GET/POST /api/:barangay/documents` | Document metadata |
| `POST /api/:barangay/documents/upload` | Upload file → GridFS (cloud) |
| `GET/DELETE /api/:barangay/documents/:id` | Download / delete file |

Query params: `?search=`, `?status=`, `?page=`, `?limit=`, `?sort=-created_at`.

---

## 5. File Storage Flow

```
Admin uploads CFA .pdf  →  POST /api/tanza-1/documents/upload
                              → GridFS streamed to brgy_tanza_1.uploads (cloud via Atlas)
                              → returns file_id
Admin links it         →  POST /api/tanza-1/documents { file_id, entity, doc_type:"cfa" }
PNP requests           →  POST document_requests (pending → approved → fulfilled)
Download              →  GET /api/tanza-1/documents/:id  (streams bytes back)
```

---

## 6. Seed & Setup

```bash
npm install
# add to .env.local:
#   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net
#   JWT_SECRET=<random-64-hex>

MONGODB_URI="..." node database/seed.js   # creates 19 dbs + default admin
npm run dev
```

Default admin: `admin` / `Admin123!@#` (change immediately).