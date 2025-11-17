"use client"

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({messages, onSend}: any) {
   const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
     messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  useEffect(scrollToBottom,[messages]);

  return (
     <div className="flex flex-col flex-1">


      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg: any, i: number) => (
          <MessageBubble
            key={i}
            isMine={msg.isMine}
            message={msg.message}
            createdAt={new Date(msg.createdAt).toLocaleTimeString()}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-lg px-3 py-2 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend(input, setInput)}
        />
        <button
          onClick={() => onSend(input, setInput)}
          className="bg-blue-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  )
}