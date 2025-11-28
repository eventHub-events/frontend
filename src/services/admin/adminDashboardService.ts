import { ReportRange } from "@/types/admin/dashboard";
import { apiClient } from "../ApiClient";
import { API_ROUTES } from "@/constants/apiRoutes";

export const  adminDashboardService = {
   fetchDashboardData : (range: ReportRange ) => apiClient.get(API_ROUTES.DASHBOARD.FETCH_DATA,{params:{range},withCredentials: true})
}