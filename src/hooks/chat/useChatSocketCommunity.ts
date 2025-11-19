"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocketCommunity(eventId:string, userId: string, role: string, onMessage: any){
  const socketRef = useRef<Socket | null>(null);
  useEffect(() => {
     if(!eventId) return;
     const socket = io("http://localhost:8000/chat/community",{
        auth: {userId, role}
     });

     socketRef.current = socket;

     socket.emit("join_event_room", eventId);
     socket.on("community_message_received", onMessage);
       return () => {
      socket.disconnect();
    };
  },[eventId]);

  const sendMessage = (data :any) => {
     socketRef.current?.emit("send_community_message", data);
  }
  return {sendMessage};
}