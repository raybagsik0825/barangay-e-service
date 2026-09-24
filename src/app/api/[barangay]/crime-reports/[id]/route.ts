import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "crime_reports",
  publicRead: true,
});

export { GET, PUT, DELETE };
