import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "cases",
  publicRead: true,
});

export { GET, PUT, DELETE };
