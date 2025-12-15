import { EVENT_ANALYTICS_ROUTES } from "@/constants/event-analytics/eventAnalyticsRoutes";
import { apiClient } from "../ApiClient";
import { EventAnalyticsFilter } from "@/components/organizer/event-analytics/EventAnalytics";

export const EVENT_ANALYTICS_SERVICE = {
  fetchEventAnalyticsData : (filter?: EventAnalyticsFilter) => apiClient.get(EVENT_ANALYTICS_ROUTES.GET_DATA, {params:{...filter},withCredentials :true})
}
