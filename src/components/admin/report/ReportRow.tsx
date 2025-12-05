"use client"

import { ReportData, ReportTypes } from "@/types/admin/report";
import { useState } from "react";
import ReportDetailsDrawer from "./ReportDetailsDrawer";

const getStatusClasses = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "reviewed":
      return "bg-blue-100 text-blue-700";
    case "action-taken":
      return "bg-green-100 text-green-700";
    case "ignored":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function ReportRow({report,onActionComplete}:{report:ReportData, onActionComplete:() => void}) {
   const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
      >
        <div>
         <p className="font-medium">
  {report.targetType === ReportTypes.CHAT_MESSAGE
    ? `Chat Message Report`
    : report.reason}
</p>

<p className="text-sm text-gray-500">
  {report.targetType === ReportTypes.CHAT_MESSAGE
    ? `Reported by ${report.reporterName} against ${report.senderName}`
    : `Reported by ${report.reporterName}`}
</p>

        </div>

       <span
  className={`text-xs capitalize px-2 py-1 rounded ${getStatusClasses(report.status)}`}
>
  {report.status.replace("-", " ")}
</span>
      </div>

      {open && (
        <ReportDetailsDrawer
          report={report}
          onClose={() => setOpen(false)}
          onActionComplete={onActionComplete}
        />
      )}
    </>
  );
}