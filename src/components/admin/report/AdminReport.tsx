"use client"

import { ReportStatus, ReportTypes } from "@/types/admin/report"
import { useState } from "react"
import ReportTabs from "./ReportTabs";
import ReportList from "./ReportList";

export default function AdminReports() {

  const[activeType, setActiveType] = useState<ReportTypes>(ReportTypes.EVENT);
  const[status, setStatus] = useState<ReportStatus>(ReportStatus.PENDING);

 return(
          <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Reports & Moderation</h1>

      <ReportTabs
        active={activeType}
        onChange={setActiveType}
      />

      <ReportList
        targetType={activeType}
        status={status}
      />
    </div>
 )

}