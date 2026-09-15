import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "hearings",
  searchable: ["venue", "outcome_notes"],
  filterable: ["case_id", "status"],
  sortable: ["scheduled_date", "created_at"],
  validate: (body: any) => {
    if (!body.case_id) return "case_id required";
    if (!body.scheduled_date) return "scheduled_date required";
    return null;
  },
});

export { GET, POST };
