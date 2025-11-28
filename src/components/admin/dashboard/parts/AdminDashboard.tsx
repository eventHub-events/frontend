import { useEffect, useState } from "react";
import RangeSelector from "./RangeSelector";
import StatCard from "./StateCard";
import { AdminDashboardDTO } from "@/types/admin/dashboard";
import ChartCard from "./ChartCard";
import BookingRevenueChart from "./BookingRevenueChart";
import SubscriptionRevenueChart from "./SubscriptionRevenueChart";
import BookingCountChart from "./BookingCountChart";
import RevenuePieChart from "./RevenuePieChart";
import { adminDashboardService } from "@/services/admin/adminDashboardService";

export default function AdminDashboardPage() {
  const [range, setRange] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [data, setData] = useState<AdminDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminDashboardService.fetchDashboardData(range);
      console.log("res", res)
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !data)
    return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <RangeSelector value={range} onChange={setRange} />
      </div>

      {/* USERS */}
      <section>
       <h2 className="font-semibold mb-3 text-gray-700 tracking-wide uppercase text-sm">Users</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Users" value={data.users.totalUsers} />
          <StatCard label="Active Users" value={data.users.activeUsers} />
          <StatCard label="Total Organizers" value={data.users.totalOrganizers} />
          <StatCard label="Active Organizers" value={data.users.activeOrganizers} />
          <StatCard
            label="Pending Verification"
            value={data.users.pendingOrganizerVerification}
          />
        </div>
      </section>

      {/* BOOKINGS */}
      <section>
        <h2 className="font-semibold mb-3 text-gray-700 tracking-wide uppercase text-sm">Bookings</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Revenue" value={`₹${data.bookings.totalRevenue}`} />
          <StatCard label="Platform Revenue" value={`₹${data.bookings.platformRevenue}`} />
          <StatCard label="Organizer Revenue" value={`₹${data.bookings.organizerRevenue}`} />
          <StatCard label="Total Bookings" value={data.bookings.bookingsCount} />
        </div>
      </section>

      {/* SUBSCRIPTIONS */}
      <section>
        <h2 className="font-semibold mb-3 text-gray-700 tracking-wide uppercase text-sm">Subscriptions</h2>
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Subscription Revenue"
            value={`₹${data.subscriptions.totalRevenue}`}
          />
          <StatCard
            label="Total Subscriptions"
            value={data.subscriptions.totalSubscriptions}
          />
          <StatCard
            label="Active Subscriptions"
            value={data.subscriptions.activeSubscriptions}
          />
        </div>
      </section>

      {/* PAYOUT */}
      <section>
       <h2 className="font-semibold mb-3 text-gray-700 tracking-wide uppercase text-sm">Payouts</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Pending Amount"
            value={`₹${data.payouts.pendingAmount}`}
          />
          <StatCard
            label="Pending Payouts"
            value={data.payouts.pendingCount}
          />
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <ChartCard title="Booking Revenue Timeline">
    <BookingRevenueChart data={data.bookings.timeline} />
  </ChartCard>

  <ChartCard title="Subscription Revenue Timeline">
    <SubscriptionRevenueChart data={data.subscriptions.timeline} />
  </ChartCard>

  <ChartCard title="Bookings Count Timeline">
    <BookingCountChart data={data.bookings.timeline} />
  </ChartCard>

  <ChartCard title="Revenue Split">
    <RevenuePieChart
      platform={data.bookings.platformRevenue}
      organizer={data.bookings.organizerRevenue}
    />
  </ChartCard>
</section>

    </div>
  );
}