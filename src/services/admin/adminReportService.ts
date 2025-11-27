import { AdminActionPayload, ReportStatus, ReportTypes } from "@/types/admin/report";
import { apiClient } from "../ApiClient";
import { API_ROUTES } from "@/constants/apiRoutes";

export const adminReportService  = {
  fetchReports: ( data:{status: ReportStatus, targetType: ReportTypes,page: number,limit: number}) => apiClient.get(API_ROUTES.REPORT.FETCH_REPORTS(data.targetType),{params:{ status: data.status,
  page: data.page,
  limit: data.limit},withCredentials:true}),
  takeAction:(reportId : string, data: AdminActionPayload) => apiClient.put(API_ROUTES.REPORT.TAKE_ACTION(reportId),data,{withCredentials: true})
}