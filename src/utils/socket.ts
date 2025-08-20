import {io,Socket} from "socket.io-client";

let socket:Socket;
export const connectSocket=(userId:string)=>{
  socket=io("http://localhost:8000",{
    auth:{userId},
    transports:["websocket"]
  });
  socket .on("connect",()=>{
console.log("connected to  webSocket")
  })
}
export const disconnectSocket=()=>{
    if (socket) socket.disconnect();
}