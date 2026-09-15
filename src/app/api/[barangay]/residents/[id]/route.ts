import { createDetailRoute } from "@/lib/api-handler";

export const { GET, PUT, DELETE } = createDetailRoute({
  collection: "residents",
});