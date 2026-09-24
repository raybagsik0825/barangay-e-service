import { createDetailRoute } from "@/lib/api-handler";

const { GET, PUT, DELETE } = createDetailRoute({
  collection: "document_requests",
});

export { GET, PUT, DELETE };
