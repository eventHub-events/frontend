"use client"
import { memo, useState } from "react";
import ReportIcon from "../user/report/ReportIcon";

interface MessageBubbleProps {
  isMine: boolean;
  message: string;
  createdAt: string;
  senderName?: string;
  messageId ?:string;
  conversationId?:string;
  senderId?: string;
  reporterId? :string;
  reporterName?: string;
  reporterRole?: string;
    mode?:"private"|"community"
}

export default memo(function MessageBubble({ isMine, message, createdAt, senderName, messageId,conversationId,senderId,reporterId,reporterName,mode }: MessageBubbleProps) {
    const [showActions, setShowActions] = useState(false);
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}
       onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="max-w-[70%] relative">

        
        {/* Show sender name ONLY for community messages & NOT mine */}
        {!isMine && senderName && (
          <div className="text-xs font-semibold text-gray-600 mb-1">
            {senderName}
          </div>
        )}

        <div
          className={`px-4 py-2 rounded-xl text-sm ${
            isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
          }`}
        >
          {message}
          <div className="text-[10px] text-gray-400 mt-1">{createdAt}</div>
            {/* ✅ Hover Actions */}
          {!isMine && showActions && (
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-50">
              <ReportIcon
                targetId={messageId!}
                targetType="chat_message"
                reporterId={reporterId!}
                reporterName={reporterName!}
                chatId={conversationId}
                senderId={senderId}
                senderName={senderName}
                mode={mode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
