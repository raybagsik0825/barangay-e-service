import { createListRoute } from "@/lib/api-handler";

export const { GET, POST } = createListRoute({
  collection: "case_parties",
  searchable: [],
  filterable: ["case_id", "role"],
  sortable: ["created_at"],
});