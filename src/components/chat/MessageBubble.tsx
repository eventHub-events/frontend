


interface MessageBubbleProps {
  isMine : boolean;
  message : string;
  createdAt : string
}

export default function MessageBubble({isMine, message, createdAt}: MessageBubbleProps) {
  console.log("craetedAt", createdAt)
 return(
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-xl max-w-[70%] text-sm ${
          isMine ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"
        }`}
      >
        {message}
        <div className="text-[10px] text-gray-300 mt-1">{createdAt}</div>
      </div>
    </div>
 )
}