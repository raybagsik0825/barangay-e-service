import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "cases",
});

export { GET, PUT, DELETE };
