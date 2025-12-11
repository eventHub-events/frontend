import { CHAT_API_ROUTES } from "@/constants/chat/chat-api-routes";
import { apiClient } from "../ApiClient";

export const chatService = {
  startPrivateChat :(payload: {userId: string, organizerId: string, eventId: string}) => apiClient.post(CHAT_API_ROUTES.START_PRIVATE_CHAT, payload,{withCredentials: true}),
  getCommunityChat :(eventId: string) => apiClient.get(CHAT_API_ROUTES.GET_COMMUNITY_CHAT(eventId),{withCredentials :true}),
  getMessages :(conversationId: string) => apiClient.get(CHAT_API_ROUTES.GET_MESSAGES(conversationId),{withCredentials: true}),

  sendMessage:(payload :{conversationId: string, senderId: string, senderType: string, message: string, createdAt: string}) => apiClient.post(CHAT_API_ROUTES.SEND_MESSAGES, payload,{withCredentials: true})
}