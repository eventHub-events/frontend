"use client";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocketPrivate(conversationId: string, userId: string, role:string, onMessage: any) {
   const socketRef = useRef<Socket | null>(null);

   useEffect(()=> {
     if(!conversationId) return;

     const socket = io("http://localhost:8000/chat/private",{
         auth: {userId,role},
         withCredentials: true
     });
     socketRef.current = socket;
     socket.emit("join_private_room", conversationId);
     socket.on("private_message_received", onMessage);

     return () => {
       socket.disconnect();
     }
   },[conversationId]);

   const sendMessage =(data: any) => {
     socketRef.current?.emit("send_private_message", data)
   }
   return {sendMessage};
}