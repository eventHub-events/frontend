import { apiClient } from "../ApiClient";

export const  eventDisplayService = {
  fetchTrendingEvents : () => apiClient.get("/api/user/events/trending"),
  fetchFeaturedEvents: () => apiClient.get("/api/user/events/featured")
}