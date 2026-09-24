import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "crime_reports",
  publicRead: true,
  searchable: ["title", "description", "location"],
  filterable: ["status", "incident_type", "severity"],
  sortable: ["incident_date", "created_at"],
  validate: (body: any) => {
    if (!body.title || !body.description) return "title and description required";
    if (!["theft", "robbery", "vandalism", "disturbance", "assault", "other"].includes(body.incident_type)) {
      return "invalid incident_type";
    }
    return null;
  },
});

export { GET, POST };
