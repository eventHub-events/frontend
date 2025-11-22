"use client";

import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import { ChatWindowProps } from "@/types/common/chat/chat";

export default function ChatWindow({ messages, onSend }: ChatWindowProps ) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i: number) => (
          <MessageBubble
            key={msg.id || i}
            isMine={msg.isMine}
            message={msg.message}
            createdAt={new Date(msg.createdAt).toLocaleTimeString()}
              senderName={msg.senderName} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2 shrink-0">
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
  );
}
