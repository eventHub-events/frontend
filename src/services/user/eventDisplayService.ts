import { EventFilterParams } from "@/interface/user/events";
import { apiClient } from "../ApiClient";

export const  eventDisplayService = {
  fetchTrendingEvents : () => apiClient.get("/api/user/events/trending"),
  fetchFeaturedEvents: () => apiClient.get("/api/user/events/featured"),
  fetchEventDetailsById:(eventId: string) => apiClient.get(`/api/user/events/${eventId}`),
  fetchAllFeaturedEvents:(params:EventFilterParams) => apiClient.get(`/api/user/events/featured/all`,{params})
}