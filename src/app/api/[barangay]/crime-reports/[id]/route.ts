import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "crime_reports",
});

export { GET, PUT, DELETE };
