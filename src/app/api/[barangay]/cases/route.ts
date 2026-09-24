import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "cases",
  publicRead: true,
  searchable: ["case_reference", "subject", "summary", "nature"],
  filterable: ["status", "case_type"],
  sortable: ["filed_date", "created_at", "case_reference"],
  validate: (body: any) => {
    if (!body.case_reference) return "case_reference required";
    if (!body.subject) return "subject required";
    return null;
  },
});

export { GET, POST };
