"use client"

import { ReportData } from "@/types/admin/report";
import { useState } from "react";
import ReportDetailsDrawer from "./ReportDetailsDrawer";

export default function ReportRow({report,onActionComplete}:{report:ReportData, onActionComplete:() => void}) {
   const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex justify-between p-4 border-b cursor-pointer hover:bg-gray-50"
      >
        <div>
          <p className="font-medium">{report.reason}</p>
          <p className="text-sm text-gray-500">
            Reported by {report.reporterName}
          </p>
        </div>

        <span className="text-xs capitalize bg-yellow-100 px-2 py-1 rounded">
          {report.status}
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