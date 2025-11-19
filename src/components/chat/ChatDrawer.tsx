"use client"
import { useChatSocketCommunity } from "@/hooks/chat/useChatSocketCommunity";
import { useChatSocketPrivate } from "@/hooks/chat/useChatSocketPrivate";
import { chatService } from "@/services/chat/chatService";
import { useEffect, useState } from "react";
import ChatWindow from "./ChatWindow";

interface Props {
  open :boolean;
  onClose: () => void;
  mode: "private" |"community";
  eventId: string;
  organizerId: string;
  userId: string;
  role: string
}

export default function ChatDrawer({open, onClose, mode,eventId, organizerId, userId,role}: Props) {
  const[conversation, setConversation] = useState<any>(null);
  const[messages, setMessages] = useState<any[]>([]);

  // load conversation //
  useEffect(() => {
     if(!open) return;
     setMessages([]);
     const load = async () => {
      if(mode === "private"){
        const res = await chatService.startPrivateChat({
           userId,
           organizerId,
           eventId
        });
         console.log("rrrrr", res)
        setConversation(res.data.data)
      }else{
         const res = await chatService.getCommunityChat(eventId);
         setConversation(res.data.data);
      }
     }
     load()
  },[open,mode]);

  //load message history //

  useEffect(() => {
    if(!conversation?.id) return;
      
     chatService.getMessages(conversation.id).then((res) => {
      setMessages(
        res.data.data.map((m: any) => ({
          ...m,
          isMine: m.senderId === userId,
        }))
      );
    });

  },[conversation]);

   const handleIncoming = (msg: any) => {
    setMessages((prev) => [...prev, { ...msg, isMine: msg.senderId === userId }]);
  };
  const { sendMessage: sendPrivate } = mode === "private"
  ? useChatSocketPrivate(conversation?.id ?? "", userId, role, handleIncoming)
  : { sendMessage: () => {} };
  const { sendMessage: sendCommunity } = mode === "community"
  ? useChatSocketCommunity(eventId, userId, role, handleIncoming)
  : { sendMessage: () => {} };
    
   // Send Logic
  const handleSend = async (text: string, reset: any) => {
    if (!text.trim()) return;

    const payload = {
      conversationId: conversation.id,
      senderId: userId,
      senderType: role,
      message: text,
      createdAt: new Date().toISOString()
    };

    await chatService.sendMessage(payload);

    // Emit socket
    if (mode === "private") sendPrivate(payload);
    else sendCommunity({ ...payload, eventId });

    reset("");
  };

  return (
  <div
 className={`fixed top-0 right-0 h-full w-[350px] bg-white shadow-xl border-l z-[9999]
transform transition-transform duration-300 overflow-hidden flex flex-col
${open ? "translate-x-0" : "translate-x-full"}`}


>

      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-bold">
          {mode === "private" ? "Chat with Organizer" : "Community Chat"}
        </h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
      </div>

      {/* Chat Window */}
      <ChatWindow messages={messages} onSend={handleSend} />
    </div>
  );

}