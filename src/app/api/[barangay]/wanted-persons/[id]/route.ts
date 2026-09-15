import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "wanted_persons",
});

export { GET, PUT, DELETE };
