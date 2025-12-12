import { useCallback, useEffect, useState } from "react";
import RangeSelector from "./RangeSelector";

import { AdminDashboardDTO } from "@/types/admin/dashboard";
import ChartCard from "./ChartCard";
import BookingRevenueChart from "./BookingRevenueChart";
import SubscriptionRevenueChart from "./SubscriptionRevenueChart";
import BookingCountChart from "./BookingCountChart";
import RevenuePieChart from "./RevenuePieChart";
import { adminDashboardService } from "@/services/admin/adminDashboardService";
import GroupStatCard from "./GroupStateCard";

// ⭐ ADD THIS IMPORT ⭐
import {
  Users,
  UserCheck,
  UserPlus,
  BadgeCheck,
  TrendingUp,
  Wallet,
  Coins,
  Crown,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [range, setRange] = useState<"daily" | "monthly" | "yearly">("monthly");
  const [data, setData] = useState<AdminDashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminDashboardService.fetchDashboardData(range);
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

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
        <GroupStatCard
          title="Users"
          icon={<Users />}
          stats={[
            { label: "Total Users", value: data.users.totalUsers, icon: <Users />, color: "bg-purple-100 text-purple-700" },
            { label: "Active Users", value: data.users.activeUsers, icon: <UserCheck />, color: "bg-green-100 text-green-700" },
            { label: "Total Organizers", value: data.users.totalOrganizers, icon: <Crown />, color: "bg-yellow-100 text-yellow-700" },
            { label: "Active Organizers", value: data.users.activeOrganizers, icon: <BadgeCheck />, color: "bg-blue-100 text-blue-700" },
            { label: "Pending Verification", value: data.users.pendingOrganizerVerification, icon: <UserPlus />, color: "bg-red-100 text-red-700" },
          ]}
        />
      </section>

      {/* BOOKINGS */}
      <section>
        <GroupStatCard
          title="Bookings"
          icon={<TrendingUp />}
          stats={[
            { label: "Total Revenue", value: `₹${data.bookings.totalRevenue}`, icon: <Wallet />, color: "bg-green-100 text-green-700" },
            { label: "Platform Revenue", value: `₹${data.bookings.platformRevenue}`, icon: <Coins />, color: "bg-indigo-100 text-indigo-700" },
            { label: "Organizer Revenue", value: `₹${data.bookings.organizerRevenue}`, icon: <Coins />, color: "bg-orange-100 text-orange-700" },
            { label: "Total Bookings", value: data.bookings.bookingsCount, icon: <TrendingUp />, color: "bg-blue-100 text-blue-700" },
          ]}
        />
      </section>

      {/* SUBSCRIPTIONS */}
      <section>
        <GroupStatCard
          title="Subscriptions"
          icon={<Crown />}
          stats={[
            { label: "Subscription Revenue", value: `₹${data.subscriptions.totalRevenue}`, icon: <Wallet />, color: "bg-green-100 text-green-700" },
            { label: "Total Subscriptions", value: data.subscriptions.totalSubscriptions, icon: <Layers />, color: "bg-blue-100 text-blue-700" },
            { label: "Active Subscriptions", value: data.subscriptions.activeSubscriptions, icon: <BadgeCheck />, color: "bg-purple-100 text-purple-700" },
          ]}
        />
      </section>

      {/* PAYOUTS */}
      <section>
        <GroupStatCard
          title="Payouts"
          icon={<Wallet />}
          stats={[
            { label: "Pending Amount", value: `₹${data.payouts.pendingAmount}`, icon: <Wallet />, color: "bg-red-100 text-red-700" },
            { label: "Pending Payouts", value: data.payouts.pendingCount, icon: <Coins />, color: "bg-yellow-100 text-yellow-700" },
          ]}
        />
      </section>

      {/* CHARTS */}
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
