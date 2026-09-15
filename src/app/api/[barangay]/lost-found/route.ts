import { createListRoute } from "@/lib/api-handler";

export const { GET, POST } = createListRoute({
  collection: "lost_found_items",
  searchable: ["item_name", "description", "location"],
  filterable: ["type", "status", "category"],
  sortable: ["date_lost_found", "created_at"],
  validate: (body: any) => {
    if (!body.item_name) return "item_name required";
    if (!["lost", "found"].includes(body.type)) return "invalid type";
    return null;
  },
});