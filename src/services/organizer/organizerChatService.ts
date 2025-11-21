import { apiClient } from "../ApiClient";

export const OrganizerChatService = {
  getOrganizerEventChats : (eventId: string)=> apiClient.get(`/api/organizer/chat/event/${eventId}`,{withCredentials: true})
}