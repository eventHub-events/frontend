



export interface CommunityAlert {
  from: string;
  conversationId: string;
  eventId :string
}


export interface PrivateAlert {
  from: string;
  conversationId: string;
  eventId?: string;
}

export interface OnlineStatusPayload {
  userId: string;
  isOnline: boolean;
}
export interface BaseMessage {
  id?: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  message: string;
  eventId: string;
  createdAt: string;
}

export interface PrivateMessage extends BaseMessage {
  receiverId: string;
  senderName?: string | undefined
}

export interface CommunityMessage extends BaseMessage {
  senderName: string;
}

export interface ChatMessageUI extends BaseMessage {
  isMine: boolean;
  senderName?: string;
}

export interface ConversationData {
  id: string;
  eventId: string;
}

export interface StatusPayload {
  userId: string;
  isOnline: boolean;
}
export interface ChatWindowProps {
  messages: ChatMessageUI[];
  onSend: (text: string, reset: (value: string) => void) => void;
}
