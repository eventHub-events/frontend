"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setUnread } from "@/redux/slices/common/chat/chatAlertSlice";
import { OnlineStatusPayload, PrivateAlert, PrivateMessage } from "@/types/common/chat/chat";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocketPrivate(
  conversationId: string,
  userId: string,
  role: string,
  onMessage: (msg: PrivateMessage) => void,
   onStatusChange?: (payload: OnlineStatusPayload) => void,
  peerId?: string,
  isChatOpen?: boolean  
) {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
      if (!conversationId) {
    console.warn("⚠️ No conversationId — NOT initializing socket");
    return;
  }
   console.log("🔌 Connecting private socket for:", conversationId);
    const socket = io("http://localhost:8000/chat/private", {
      auth: { userId, role }
    });

    socketRef.current = socket;

   
     socket.emit("join_private_room", {
        conversationId,
        peerId,
        userId
      });
    socket.emit("user_online", userId);
    if (isChatOpen) {
    socket.emit("chat_open", { userId, conversationId });
  }

    // Receive messages
    socket.on("private_message_received", (msg: PrivateMessage) => {
      onMessage(msg);
    });

    socket.on("new_message_alert", (alert: PrivateAlert) => {
      console.log("🔔 NEW PRIVATE MESSAGE", alert);

      

      if (alert.from !== userId) {
        dispatch(setUnread(alert.conversationId));
      }
    });
   
    // Online/offline status

    if (onStatusChange) {
      socket.on("online_status_change", (payload: OnlineStatusPayload) => {
        onStatusChange(payload);
      });
    }

    return () => {
      socket.emit("chat_close", { userId }); 
      socket.disconnect();
    };
  }, [conversationId, isChatOpen, dispatch,peerId,role,userId,onMessage,onStatusChange]);

  const sendMessage = (data: PrivateMessage) => {
     
    socketRef.current?.emit("send_private_message", data);
  };

  return { sendMessage,socketRef };
}
