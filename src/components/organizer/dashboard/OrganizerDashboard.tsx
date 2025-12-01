"use client";

 import StatCard from "@/components/admin/dashboard/parts/StateCard";
// import EventPerformanceTable from "./EventPerformanceTable";
import RevenueChart from "./RevenueChart";
import BookingChart from "./BookingChart";
import { useCallback, useEffect, useState } from "react";
import { organizerDashboardService } from "@/services/organizer/dashboard/organizerDashboardService";
import { OrganizerDashboardDTO } from "@/types/organizer/dashboard";




export default function OrganizerDashboardPage() {
  const [data, setData] =
    useState<OrganizerDashboardDTO | null>(null);

  const [range] =
    useState<"daily" | "monthly" | "yearly">("monthly");

    
    const fetchDashboard = useCallback(async () => {
      const res = await organizerDashboardService.fetchDashboardData(range);
      console.log("res", res);
      setData(res.data.data);
    }, [range]);
    useEffect(() => {
      fetchDashboard();
    }, [range,fetchDashboard]);


  if (!data)
    return <div className="p-6">Loading dashboard…</div>;

  return (
    <div className="p-6 space-y-6">

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Revenue" value={`₹${data.summary.totalRevenue}`} />
        <StatCard label="Total Bookings" value={data.summary.totalBookings} />
        <StatCard label="Tickets Sold" value={data.summary.totalTicketsSold} />
        <StatCard label="Pending Payout" value={`₹${data.payouts.pendingAmount}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RevenueChart data={data.revenue.timeline} />
        <BookingChart data={data.bookings.timeline} />
      </div>

      {/* Event Performance */}
      {/* <EventPerformanceTable /> */}
    </div>
  );
}