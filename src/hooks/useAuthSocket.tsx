"use client"

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { organizerLogout } from "@/redux/slices/organizer/authSlice";
import { userLogout } from "@/redux/slices/user/authSlice";
import { RootState } from "@/redux/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {io, Socket } from "socket.io-client"



export const useAuthSocket=()=>{
  const router= useRouter();
  const user= useAppSelector((state:RootState)=>state.auth.user);
  const organizer= useAppSelector((state:RootState)=>state.organizerAuth.organizer);
  
  const activeAccount= user|| organizer;
  const role= user ?"user":organizer?"organizer":null
  const dispatch=useAppDispatch()



const socketRef = useRef<Socket | null>(null);
  useEffect(()=>{
   
     if (!activeAccount?.id || !role){  
      console.log("no  active account")
      return
      
     } ;
 
const socket=io("http://localhost:8000/user",{
    auth:{userId:activeAccount.id,role:role},
    transports:["websocket"],
    withCredentials: true,
  });
 
  socketRef.current=socket
  socket .on("connect",()=>{
console.log("connected to  webSocket for user:",activeAccount?.id,activeAccount.name)
  })
    socket .on("blocked",()=>{
      // localStorage.removeItem("userInfo")
      toast.success("You have been  blocked")
       if(role==="user")dispatch(userLogout())
      else dispatch(organizerLogout())
      router.push(`/login/${role}`)
    })


 return () => {
      socket.disconnect();
      socketRef.current=null;
      console.log("🔌 WebSocket disconnected");
    };
  },[activeAccount?.id,role,router])

  const blockUser=(userId:string)=>{
    if(!socketRef.current)return
    socketRef.current.emit("block-user",{targetUserId:userId})
  }
  return{
    socket:socketRef.current,
    blockUser
  }
  
}