"use client";

import { useState } from "react";
import { adminReportService } from "@/services/admin/adminReportService";
import { ReportActions, ReportData, ReportStatus, ReportTypes } from "@/types/admin/report";
import { showSuccess } from "@/utils/toastService";

interface Props {
  report: ReportData;
  onClose: () => void;
  onActionComplete: () => void;
}

export default function ReportDetailsDrawer({
  report,
  onClose,
  onActionComplete
}: Props) {
  const [action, setAction] = useState<ReportActions | null>(null);
  const [status, setStatus] = useState<ReportStatus>(report.status);
  const [note, setNote] = useState(report.adminNote ?? "");

  const isResolved = report.status !== ReportStatus.PENDING;

  const submitAction = async () => {
    try {
      const payload = {
        reportId: report.id!,
        status,
        action: action!,
        adminNote: note
      };

     const result = await adminReportService.takeAction(report.id!, payload);
     if(result){
       showSuccess("Action taken successfully")

     }
      
      onActionComplete();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-xl p-6 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Report Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          ✕
        </button>
      </div>

      {/* Report Info */}
      <div className="space-y-2 text-sm">
        <p><strong>Target Type:</strong> {report.targetType}</p>
        <p><strong>Reason:</strong> {report.reason}</p>
        {report.description && (
          <p className="text-gray-600">{report.description}</p>
        )}
        <p>
          <strong>Status:</strong>{" "}
          <span className="capitalize">{status}</span>
        </p>
        {report.action && (
          <p>
            <strong>Action Taken:</strong>{" "}
            <span className="capitalize">{report.action}</span>
          </p>
        )}
      </div>
                            {/* ✅ Chat Message Snapshot */}
{report.targetType === ReportTypes.CHAT_MESSAGE && (
  <div className="mt-4 p-3 rounded bg-gray-50 text-sm space-y-1">
    <p>
      <strong>Sender:</strong>{" "}
      <span className="text-gray-700">{report.senderName}</span>
    </p>

    <p>
      <strong>Message ID:</strong>{" "}
      <span className="text-gray-500 text-xs">{report.targetId}</span>
    </p>

    {report.messageSnapshot && (
  <div className="mt-2 text-sm text-gray-700">
    <p className="font-semibold text-gray-800 mb-1">
      Message:
    </p>

    <div className="italic border-l-4 border-red-400 pl-3 text-gray-600">
      “{report.messageSnapshot}”
    </div>
  </div>
)}

  </div>
)}


      {/* Admin Note */}
      <textarea
        value={note}
        disabled={isResolved}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Admin note"
        className="w-full border rounded p-2 mt-4 min-h-[90px] disabled:bg-gray-100"
      />

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          disabled={isResolved}
          className="border px-4 py-2 rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => {
            setAction(ReportActions.NOT_NEEDED);
            setStatus(ReportStatus.IGNORED);
          }}
        >
          Ignore
        </button>

        <button
          disabled={isResolved}
          className="border px-4 py-2 rounded hover:bg-yellow-50 disabled:opacity-50"
          onClick={() => {
            setAction(ReportActions.WARN);
            setStatus(ReportStatus.ACTION_TAKEN);
          }}
        >
          Warn
        </button>

        <button
          disabled={isResolved}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          onClick={() => {
            setAction(ReportActions.BLOCK);
            setStatus(ReportStatus.ACTION_TAKEN);
          }}
        >
          Block
        </button>
      </div>

      {/* Confirm */}
      {!isResolved && status !== ReportStatus.PENDING && (
        <button
          className="w-full mt-6 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          onClick={submitAction}
        >
          Confirm Action
        </button>
      )}

      {isResolved && (
        <div className="mt-6 text-sm text-gray-500 text-center">
          This report has already been processed.
        </div>
      )}
    </div>
  );
}
