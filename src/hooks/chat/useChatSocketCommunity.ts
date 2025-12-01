"use client";

import { useAppDispatch } from "@/redux/hooks";
import { setCommunityUnread } from "@/redux/slices/common/chat/chatAlertSlice";
import { CommunityAlert, CommunityMessage } from "@/types/common/chat/chat";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocketCommunity(
  eventId: string,
  userId: string,
  role: string,
  onMessage: (msg: CommunityMessage) => void,
  isChatOpen?: boolean
) {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = io("http://localhost:8000/chat/community", {
      auth: { userId, role }
    });

    socketRef.current = socket;

    if (eventId) {
      socket.emit("join_event_room", eventId);
    }

     socket.on("community_message_received", (msg: CommunityMessage) => {
      onMessage(msg);
    });

    socket.on("new_message_alert", (alert: CommunityAlert) => {
      console.log("🔔 COMMUNITY NEW MESSAGE", alert);

      // if (isChatOpen) return;

      if (alert.from !== userId) {
        dispatch(setCommunityUnread());
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [eventId, isChatOpen,dispatch,onMessage,role,userId]);

  const sendMessage = (data: CommunityMessage) => {
    socketRef.current?.emit("send_community_message", data);
  };

  return { sendMessage };
}
