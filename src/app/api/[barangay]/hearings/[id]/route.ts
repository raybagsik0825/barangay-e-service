import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "hearings",
});

export { GET, PUT, DELETE };
