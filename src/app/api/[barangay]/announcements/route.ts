import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "announcements",
  publicRead: true,
  searchable: ["title", "body"],
  filterable: ["category", "is_published", "is_pinned"],
  sortable: ["published_at", "created_at"],
  validate: (body: any) => {
    if (!body.title || !body.body) return "title and body required";
    if (!["advisory", "event", "health", "project", "alert"].includes(body.category)) {
      return "invalid category";
    }
    return null;
  },
});

export { GET, POST };
