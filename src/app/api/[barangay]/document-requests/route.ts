import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "document_requests",
  publicCreate: true,
  searchable: ["request_code", "requesting_office", "purpose"],
  filterable: ["status"],
  sortable: ["requested_at", "created_at"],
  validate: (body: any) => {
    if (!body.request_code) return "request_code required";
    if (!body.requesting_office) return "requesting_office required";
    if (!body.purpose) return "purpose required";
    return null;
  },
});

export { GET, POST };
