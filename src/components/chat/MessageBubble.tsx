import { memo } from "react";

interface MessageBubbleProps {
  isMine: boolean;
  message: string;
  createdAt: string;
  senderName?: string;  // ✅ new
}

export default memo(function MessageBubble({ isMine, message, createdAt, senderName }: MessageBubbleProps) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div className="max-w-[70%]">
        
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
        </div>
      </div>
    </div>
  );
});
