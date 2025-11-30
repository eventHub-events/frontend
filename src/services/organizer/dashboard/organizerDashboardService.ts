import { ReportRange } from "@/types/admin/dashboard";

import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "@/services/ApiClient";

export const  organizerDashboardService = {
   fetchDashboardData : (range: ReportRange ) => apiClient.get(API_ROUTES.ORGANIZER_DASHBOARD.FETCH_DATA,{params:{range},withCredentials: true})
}