// Central config for the admin panel: which fields each module shows in its
// Records tab, and how document types are grouped into CFA / Police / Media.

export interface AdminField {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "datetime" | "select" | "number";
  options?: string[];
  required?: boolean;
  column?: boolean; // show in the list table
}

export interface AdminModule {
  path: string;
  label: string;
  collection: string;
  /** entity_type value used when linking uploaded media to these records */
  entityType: string;
  fields: AdminField[];
}

// ---- Generic record modules (backed by CRUD API collections) ---------------

export const adminModules: AdminModule[] = [
  {
    path: "announcements",
    label: "Announcements",
    collection: "announcements",
    entityType: "announcement",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, column: true },
      { key: "category", label: "Category", type: "select", options: ["advisory", "event", "health", "project", "alert"], required: true, column: true },
      { key: "body", label: "Body", type: "textarea", required: true },
      { key: "is_published", label: "Published", type: "select", options: ["true", "false"], column: true },
      { key: "published_at", label: "Publish date", type: "date" },
    ],
  },
  {
    path: "residents",
    label: "Residents",
    collection: "residents",
    entityType: "resident",
    fields: [
      { key: "first_name", label: "First name", type: "text", required: true, column: true },
      { key: "last_name", label: "Last name", type: "text", required: true, column: true },
      { key: "middle_name", label: "Middle name", type: "text" },
      { key: "sex", label: "Sex", type: "select", options: ["male", "female"], column: true },
      { key: "birth_date", label: "Birth date", type: "date" },
      { key: "contact_number", label: "Contact", type: "text", column: true },
      { key: "purok", label: "Purok", type: "text", column: true },
      { key: "status", label: "Status", type: "select", options: ["active", "inactive", "deceased"], column: true },
    ],
  },
  {
    path: "cases",
    label: "Cases",
    collection: "cases",
    entityType: "case",
    fields: [
      { key: "case_reference", label: "Case ref #", type: "text", required: true, column: true },
      { key: "subject", label: "Subject", type: "text", required: true, column: true },
      { key: "case_type", label: "Type", type: "select", options: ["lupon", "crime", "administrative"], column: true },
      { key: "nature", label: "Nature", type: "text" },
      { key: "status", label: "Status", type: "select", options: ["docketed", "for_preliminary", "for_hearing", "resolved", "dismissed", "archived"], column: true },
      { key: "filed_date", label: "Filed date", type: "date", column: true },
      { key: "summary", label: "Summary", type: "textarea" },
    ],
  },
  {
    path: "hearings",
    label: "Hearings",
    collection: "hearings",
    entityType: "hearing",
    fields: [
      { key: "case_id", label: "Case ID", type: "text", required: true, column: true },
      { key: "scheduled_date", label: "Date", type: "date", required: true, column: true },
      { key: "start_time", label: "Start", type: "text" },
      { key: "venue", label: "Venue", type: "text", column: true },
      { key: "status", label: "Status", type: "select", options: ["scheduled", "held", "postponed", "cancelled"], column: true },
      { key: "outcome_notes", label: "Outcome / minutes", type: "textarea" },
    ],
  },
  {
    path: "crime-reports",
    label: "Crime Reports",
    collection: "crime_reports",
    entityType: "crime_report",
    fields: [
      { key: "title", label: "Title", type: "text", required: true, column: true },
      { key: "incident_type", label: "Type", type: "select", options: ["theft", "robbery", "vandalism", "disturbance", "assault", "other"], required: true, column: true },
      { key: "location", label: "Location", type: "text", column: true },
      { key: "incident_date", label: "Date", type: "datetime", column: true },
      { key: "severity", label: "Severity", type: "select", options: ["low", "medium", "high"], column: true },
      { key: "status", label: "Status", type: "select", options: ["active", "under_investigation", "resolved", "closed"], column: true },
      { key: "description", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    path: "wanted-persons",
    label: "Wanted Persons",
    collection: "wanted_persons",
    entityType: "wanted_person",
    fields: [
      { key: "first_name", label: "First name", type: "text", required: true, column: true },
      { key: "last_name", label: "Last name", type: "text", required: true, column: true },
      { key: "alias", label: "Alias", type: "text", column: true },
      { key: "danger_level", label: "Danger", type: "select", options: ["low", "moderate", "high"], column: true },
      { key: "status", label: "Status", type: "select", options: ["wanted", "arrested", "cleared", "deactivated"], column: true },
      { key: "last_known_location", label: "Last known location", type: "text" },
      { key: "charges_or_description", label: "Charges / description", type: "textarea" },
    ],
  },
  {
    path: "lost-found",
    label: "Lost & Found",
    collection: "lost_found_items",
    entityType: "lost_found_item",
    fields: [
      { key: "item_name", label: "Item", type: "text", required: true, column: true },
      { key: "type", label: "Type", type: "select", options: ["lost", "found"], required: true, column: true },
      { key: "category", label: "Category", type: "text", column: true },
      { key: "location", label: "Location", type: "text", column: true },
      { key: "date_lost_found", label: "Date", type: "date", column: true },
      { key: "status", label: "Status", type: "select", options: ["open", "pending_claim", "claimed", "returned", "closed"], column: true },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },
];

export function getAdminModule(path: string): AdminModule | undefined {
  return adminModules.find((m) => m.path === path);
}

// ---- Document groupings ----------------------------------------------------

// Certificate to File Action (+ supporting legal docs)
export const CFA_DOC_TYPES = ["cfa", "settlement", "certificate"];
export const CFA_LABEL = "CFA & Legal Certificates";

// Police files: subpoenas, complaint records, hearing logs (+ fulfilled CFA copies)
export const POLICE_DOC_TYPES = ["subpoena", "complaint_record", "hearing_log", "cfa"];
export const POLICE_LABEL = "Police Files";

// Media kinds for the upload tabs
export type MediaKind = "photos" | "videos" | "files";

export const MEDIA_KINDS: { key: MediaKind; label: string; accept: string; hint: string }[] = [
  { key: "photos", label: "Pictures", accept: "image/*", hint: "JPG, PNG, GIF, WebP" },
  { key: "videos", label: "Videos", accept: "video/*", hint: "MP4, WebM" },
  { key: "files", label: "Other media", accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,audio/*", hint: "PDF, Office docs, audio, archives" },
];

export function kindOfMime(mime: string): MediaKind {
  if (mime.startsWith("image/")) return "photos";
  if (mime.startsWith("video/")) return "videos";
  return "files";
}

// doc_type choices shown in the uploader, grouped
export const DOC_TYPE_OPTIONS = [
  "cfa",
  "subpoena",
  "hearing_log",
  "complaint_record",
  "settlement",
  "certificate",
  "photo",
  "proof",
  "misc",
];
