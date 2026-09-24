import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "hearings",
  publicRead: true,
});

export { GET, PUT, DELETE };
