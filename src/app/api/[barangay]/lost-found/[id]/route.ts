import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "lost_found_items",
  publicRead: true,
});

export { GET, PUT, DELETE };
