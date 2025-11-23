"use client";

import { useChatSocketCommunity } from "@/hooks/chat/useChatSocketCommunity";
import { useChatSocketPrivate } from "@/hooks/chat/useChatSocketPrivate";
import { chatService } from "@/services/chat/chatService";
import { useCallback, useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";
import { ChatMessageUI, CommunityMessage, ConversationData, PrivateMessage, StatusPayload } from "@/types/common/chat/chat";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "private" | "community";
  eventId: string;
  organizerId: string;
  userId: string;
  role: string;
  conversationId?: string;
  userName?: string;
  peerId?: string;
  targetName?: string;
  isChatOpen: boolean;
}

export default function ChatDrawer({
  open,
  onClose,
  mode,
  eventId,
  organizerId,
  userId,
  role,
  conversationId,
  userName,
  peerId,
  targetName,
  isChatOpen
}: Props) {

  const [conversation, setConversation] = useState<ConversationData| null>(null);
  const [messages, setMessages] = useState<ChatMessageUI[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!open) return;

    setMessages([]);

    const load = async () => {
      let convId = conversationId;

      // Fetch conversation
      if (!convId) {
        const res =
          mode === "private"
            ? await chatService.startPrivateChat({ userId, organizerId, eventId })
            : await chatService.getCommunityChat(eventId);

        setConversation(res.data.data);
        convId = res.data.data.id;
      } else {
        setConversation({ id: conversationId!, eventId });
      }

      // Load messages
      const msgRes = await chatService.getMessages(convId!);
      const messageList = msgRes.data.data as (PrivateMessage | CommunityMessage)[];
      setMessages(
        messageList.map((m) => ({
          ...m,
          isMine: m.senderId === userId
        }))
      );
    };

    load();
  }, [open, mode, conversationId]);

  const handleIncoming = useCallback(
    (msg: PrivateMessage| CommunityMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          isMine: msg.senderId === userId,
          senderName: mode === "community" ? msg.senderName : undefined
        }
      ]);
    },
    [userId, mode]
  );

  const handleStatusChange = useCallback(
    (data: StatusPayload) => {
      if (!conversation) return;
      if (data.userId === peerId) {
        setIsOnline(data.isOnline);
      }
    },
    [conversation, peerId]
  );

  // PRIVATE CHAT SOCKET HOOK
  const { sendMessage: sendPrivate,socketRef } =
    mode === "private" 
      ? useChatSocketPrivate(
          conversation?.id! ,
          userId,
          role,
          handleIncoming,
          handleStatusChange,
          peerId,
          isChatOpen // ✅ FIXED
        )
      : { sendMessage: () => {} };

  // COMMUNITY CHAT SOCKET HOOK
  const { sendMessage: sendCommunity } =
    mode === "community"
      ? useChatSocketCommunity(
          eventId,
          userId,
          role,
          handleIncoming,
          isChatOpen // ✅ FIXED
        )
      : { sendMessage: () => {} };
      
  useEffect(() => {
  if (!open) return;                 // run only when opened
  if (!conversation?.id) return;     // wait until conversation exists
  if (mode !== "private") return;    // only for private chat
  if (!socketRef?.current) return;

  socketRef.current.emit("chat_open", {
    userId,
    conversationId: conversation.id,
  });

}, [open, conversation?.id]);

useEffect(() => {
  if (open) return;                  // run only when closing
  if (!conversation?.id) return;
  if (mode !== "private") return;
  if (!socketRef?.current) return;

  socketRef.current.emit("chat_close", { userId });

}, [open]);



  // Send Logic
  const handleSend = async (text: string, reset: (value: string) => void) => {
    if (!text.trim()) return;

    const payload = {
      conversationId: conversation?.id,
      senderId: userId,
      senderType: role,
      senderName: mode === "community" ? userName : undefined,
      eventId,
      message: text,
      createdAt: new Date().toISOString(),
      receiverId: peerId
    };
    if(mode === "community"){
      
      await chatService.sendMessage(payload as PrivateMessage | CommunityMessage);
    }

    if (mode === "private") sendPrivate(payload as PrivateMessage);
    else sendCommunity(payload as CommunityMessage);

    reset("");
  };
 
 
  
  return (
    <div
      className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl border-l z-[9999]
      transform transition-transform duration-300 overflow-hidden flex flex-col
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold">
          {mode === "private" ? targetName : "Community Chat"}

          {mode === "private" && (
            <span
              className={`w-3 h-3 rounded-full ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          )}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      <ChatWindow messages={messages} onSend={handleSend} />
    </div>
  );
}
