import { ReportRange } from "@/types/admin/dashboard";

import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "@/services/ApiClient";
import { OrganizerDashboardFilter } from "@/interface/organizer/dashboard/dashboard";

export const  organizerDashboardService = {
   fetchDashboardData : (range: ReportRange ) => apiClient.get(API_ROUTES.ORGANIZER_DASHBOARD.FETCH_DATA,{params:{range},withCredentials: true}),
   fetchDashboardDetails : (filter: OrganizerDashboardFilter ) => apiClient.get(API_ROUTES.ORGANIZER_DASHBOARD.FETCH_DASHBOARD_DETAILS,{params:{...filter},withCredentials: true})
}