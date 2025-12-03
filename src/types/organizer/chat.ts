export interface ConversationResponseDTO {
   id?: string;
  eventId: string;
  participants: string[];
  lastMessage?: string;
  type: ConversationType;
  lastSenderId?:  string;
  userId?:string
  userName?:string;
  unreadCount?:number;
}

export enum ConversationType  {
   PRIVATE = "private",
   COMMUNITY ="community"
 }

 export interface ConversationResponseDTO {
  id?: string;
  eventId: string;
  participants: string[];
  lastMessage?: string;
  type: ConversationType;
  lastSenderId?:  string;
  userId?:string
  userName?:string;
  unreadCount?:number;
}

export interface SelectedConversationType {
                 mode: ConversationType,
                conversationId?: string,
                userName?: string,
                userId?: string,
                eventId?: string,
                peerId?: string,
}

export interface ConversationsDataType {
  communityChat: ConversationResponseDTO;
  privateChats: ConversationResponseDTO[];
}
