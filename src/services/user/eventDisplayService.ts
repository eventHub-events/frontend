import { EventFilterParams, SearchEventsParams } from "@/interface/user/events";
import { apiClient } from "../ApiClient";
import { API_ROUTES } from "@/constants/apiRoutes";


export const  eventDisplayService = {
  fetchUpcomingEvents: () => apiClient.get(API_ROUTES.EVENTS.FETCH_UPCOMING_EVENTS),
  fetchTrendingEvents : () => apiClient.get(API_ROUTES.EVENTS.FETCH_TRENDING_EVENTS),
  fetchFeaturedEvents: () => apiClient.get(API_ROUTES.EVENTS.FETCH_FEATURED_EVENTS),
  fetchEventDetailsById:(eventId: string) => apiClient.get(API_ROUTES.EVENTS.FETCH_EVENT_DETAILS_BY_ID(eventId),{withCredentials: true}),
  fetchAllFeaturedEvents:(params:EventFilterParams) => apiClient.get(API_ROUTES.EVENTS.FETCH_ALL_FEATURED_EVENTS,{params}),
  fetchAllEventByFilter :(params : EventFilterParams) => apiClient.get(API_ROUTES.EVENTS.FETCH_BY_FILTER,{params}),
  fetchSearchedEvents:(params: SearchEventsParams) => apiClient.get(API_ROUTES.EVENTS.FETCH_SEARCH_EVENTS,{params})
}