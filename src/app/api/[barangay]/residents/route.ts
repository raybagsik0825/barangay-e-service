import { createListRoute } from "@/lib/api-handler";

const { GET, POST } = createListRoute({
  collection: "residents",
  searchable: ["first_name", "middle_name", "last_name", "alias"],
  filterable: ["status", "purok", "zone", "civil_status", "sex"],
  sortable: ["last_name", "registered_at", "birth_date"],
  validate: (body: any) => {
    if (!body.first_name || !body.last_name) return "first_name and last_name required";
    return null;
  },
});

export { GET, POST };
