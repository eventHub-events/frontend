import { CreateReportDTO } from "@/types/user/report/report";
import { apiClient } from "../ApiClient";
import { API_ROUTES } from "@/constants/apiRoutes";

export const reportService  = {
  createEventReport:(data: CreateReportDTO) => apiClient.post(API_ROUTES.REPORT.CREATE_EVENT_REPORT, data,{withCredentials: true}),
  createOrganizerReport:(data: CreateReportDTO) => apiClient.post(API_ROUTES.REPORT.CREATE_ORGANIZER_REPORT, data,{withCredentials: true}),
  createChatReport :(data :CreateReportDTO) => apiClient.post(API_ROUTES.REPORT.CREATE_CHAT_REPORT, data,{withCredentials :true})
}