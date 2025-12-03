"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import ReportModal from "./ReportModal";


interface Props {
  targetId: string;
  targetType: "event" | "organizer"|"chat_message";
  reporterId: string;
 reporterName: string;
 reporterRole?: string;
 chatId?: string;
 senderId?:string;
 senderName?:string;
   mode?:"private"|"community"
}

export default function ReportIcon({ targetId, targetType,reporterId,reporterName,reporterRole, chatId ,senderId, senderName, mode}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 🔥 important
          setOpen(true);
        }}
        className="bg-black/50 hover:bg-black/70 text-white 
                   rounded-full p-2 transition"
        title="Report"
      >
        <Flag size={16} />
      </button>

      {open && (
        <ReportModal
          targetId={targetId}
          targetType={targetType}
          onClose={() => setOpen(false)}
          reporterId={reporterId}
          reporterName={reporterName}
          reporterRole={reporterRole}
          chatId = {chatId}
          senderId ={senderId!}
          senderName={senderName}
          mode={mode}
        />
      )}
    </>
  );
}
