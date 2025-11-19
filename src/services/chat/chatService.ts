import { apiClient } from "../ApiClient";

export const chatService = {
  startPrivateChat :(payload: {userId: string, organizerId: string, eventId: string}) => apiClient.post("/api/chat/private", payload,{withCredentials: true}),
  getCommunityChat :(eventId: string) => apiClient.get(`/api/chat/community/${eventId}`,{withCredentials :true}),
  getMessages :(conversationId: string) => apiClient.get(`/api/chat/messages/${conversationId}`,{withCredentials: true}),

  sendMessage:(payload :{conversationId: string, senderId: string, senderType: string, message: string, createdAt: string}) => apiClient.post("/api/chat/send", payload,{withCredentials: true})
}