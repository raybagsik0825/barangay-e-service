import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "case_parties",
  searchable: [],
  filterable: ["case_id", "role"],
  sortable: ["created_at"],
});

export { GET, POST };
