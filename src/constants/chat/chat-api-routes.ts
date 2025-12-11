export const CHAT_API_ROUTES = {
  START_PRIVATE_CHAT : "/api/chat/private",
  GET_COMMUNITY_CHAT : (eventId: string) => `/api/chat/community/${eventId}`,
  GET_MESSAGES : (conversationId :string) => `/api/chat/messages/${conversationId}`,
  SEND_MESSAGES : "/api/chat/send"
}