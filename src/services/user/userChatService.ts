import { API_ROUTES } from "@/constants/apiRoutes";
import { apiClient } from "../ApiClient";

export const UserChatService = {
  getUnreadCount :(eventId: string) => apiClient.get(API_ROUTES.GET_USER_CHAT_COUNT(eventId),{withCredentials: true})
}