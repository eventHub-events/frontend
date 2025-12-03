"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { showError, showSuccess } from "@/utils/toastService";
import { reportService } from "@/services/user/reportService";
import { CreateReportDTO } from "@/types/user/report/report";
import { AxiosError } from "axios";
import ModalPortal from "./ModalPortal";



interface Props {
  targetId: string;
  targetType: "event" | "organizer" | "user"|"chat_message";
  reporterId: string;
 reporterName: string;
 reporterRole?: string;
 chatId?:string;
  onClose: () => void;
  senderId?: string;
  senderName?:string;
    mode?:"private"|"community"
}

const REPORT_REASONS = {
  event: [
    "Misleading event details",
    "Inappropriate content",
    "Fraud or scam",
    "Cancelled without notice",
    "Other",
  ],
  organizer: [
    "Abusive behavior",
    "Fraud or scam",
    "Harassment",
    "Violation of platform rules",
    "Other",
  ],
  user: [
    "Abusive language",
    "Spam",
    "Harassment",
    "Fake account",
    "Other",
  ],
   chat_message: [ // ✅ ADD THIS
    "Abusive language",
    "Harassment",
    "Spam",
    "Hate speech",
    "Other",
  ],
};

export default function ReportModal({
  targetId,
  targetType,
  onClose,
   reporterId,
   reporterName,
    reporterRole,
    senderId,
    senderName,
    chatId,
    mode

}: Props) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  // const [loading, setLoading] = useState(false);
  

  const reasons = REPORT_REASONS[targetType];

  const handleSubmit = async () => {
    if (!reason) {
      showError("Please select a reason");
      return;
    }

    try {
      // setLoading(true);
    
       const payload: CreateReportDTO = {
            targetId,
           targetType,
          reason,
          description,
          reporterId,
          reporterName,
          reporterRole,
          senderId,
          senderName,
          chatId,
          mode
          
       }
       console.log("payylaod", payload)
    if(targetType === "event" ){
       await reportService.createEventReport(payload)
       showSuccess("Report submitted successfully");
       onClose();
      }else if(targetType === "organizer"){
        await reportService.createOrganizerReport(payload)
        showSuccess("Report submitted successfully");
        onClose();
    }else if (targetType === "chat_message") {
      await reportService.createChatReport(payload); // ✅ IMPORTANT
    }
      showSuccess("Report submitted successfully");
    onClose();

    } catch (err) {
      console.log(err)
       const message = err instanceof AxiosError?err.response?.data.message: "Failed to  submit the  report"
      showError(message);
    } finally {
      // setLoading(false);
    }
  };

  return (
     <ModalPortal>
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
  <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">

    <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
      <X size={18} />
    </button>

    <h2 className="text-lg text-black font-semibold mb-4">Report {targetType}</h2>

    {/* Reason */}
    <label className="block text-red-800 font-medium mb-2">
      Reason <span className="text-red-500">*</span>
    </label>

    <select
      value={reason}
      onChange={(e) => setReason(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
    >
      <option value="" className="text-gray-400">Select a reason</option>
      {reasons.map((r) => (
        <option key={r} value={r}>{r}</option>
      ))}
    </select>

    {/* Description */}
    <label className="block text-sm font-medium mb-2">Additional details</label>

    <textarea
      rows={4}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Briefly explain the issue..."
      className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

    {/* Actions */}
    <div className="flex justify-end gap-3 mt-6">
      <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-600">Cancel</button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Submit Report
      </button>
    </div>

  </div>
</div>
 </ModalPortal>

  );
}
