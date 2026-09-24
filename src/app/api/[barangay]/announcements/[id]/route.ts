import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "announcements",
  publicRead: true,
});

export { GET, PUT, DELETE };
