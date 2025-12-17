"use client"

import { useAppSelector } from "@/redux/hooks"
import { RootState } from "@/redux/store/store"
import { useEffect, useRef } from "react"
import { toast } from "react-toastify"
import { io,Socket } from "socket.io-client"


export const useAdminSocket=()=>{
  const admin= useAppSelector((state:RootState)=>state.adminAuth.admin)
  const adminId=admin?.id
  const socketRef=useRef<Socket|null>(null)
  useEffect(()=>{
     if(!adminId)return
     const socket=io(process.env.NEXT_PUBLIC_ADMIN_SOCKET_URL!,{
  auth:{
    userId:adminId,
    role:"admin"
  },
  transports:["websocket"],
  withCredentials:true

})
socketRef.current=socket;
socket.on("connect",()=>{
  console.log("admin socket connected",adminId)

})
socket.on("block-user-success",(data)=>{
  toast.success(`${data?.result?.name} was ${data.result.isBlocked?"blocked":"unblocked"}`)
  console.log("success")
  console.log(data)
})
socket.on("disConnect",()=>{
  console.log("admin socket  disconnected")
})
return ()=>{
  socket.disconnect()
  socketRef.current=null
}
  },[adminId])
    const blockUser = (userId: string,isBlocked:boolean) => {
    if (!socketRef.current) return;
    socketRef.current.emit("block-user", { targetUserId: userId,isBlocked });
  };

  return {
    socket: socketRef.current,
    blockUser,
  };

}