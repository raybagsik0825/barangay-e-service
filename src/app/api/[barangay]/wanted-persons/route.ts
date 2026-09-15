import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "wanted_persons",
  searchable: ["first_name", "middle_name", "last_name", "alias"],
  filterable: ["status", "danger_level"],
  sortable: ["created_at", "last_name"],
  validate: (body: any) => {
    if (!body.first_name || !body.last_name) return "first_name and last_name required";
    return null;
  },
});

export { GET, POST };
