"use client";

import { adminReportService } from "@/services/admin/adminReportService";
import { ReportData, ReportStatus, ReportTypes } from "@/types/admin/report";
import { useCallback, useEffect, useState } from "react";
import ReportRow from "./ReportRow";
import Pagination from "@/components/ui/Pagination";

interface Props {
  targetType: ReportTypes;
  status: ReportStatus;
}

const LIMIT = 10;

export default function ReportList({ targetType, status }: Props) {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1); // reset page on filter change
  }, [targetType, status]);

  

 const fetchReports = useCallback(async () => {
  try {
    setLoading(true);

    const res = await adminReportService.fetchReports({
      targetType,
      status,
      page: currentPage,
      limit: LIMIT,
    });
    console.log("resss", res)
    setReports(res.data.data.reportData);
    setTotalPages(res.data.data.total);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [targetType, status, currentPage]);

 useEffect(() => {
    fetchReports();
  }, [targetType, status, currentPage, fetchReports]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No reports found
          </div>
        ) : (
          reports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              onActionComplete={fetchReports}
            />
          ))
        )}
      </div>

      {/* ✅ Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
