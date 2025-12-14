"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";

import { organizerDashboardService } from "@/services/organizer/dashboard/organizerDashboardService";
import { IOrganizerDashboardOverview } from "@/interface/organizer/dashboard/dashboard";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  CartesianGrid
} from "recharts";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export default function OrganizerDashboardDetail() {
  const [data, setData] = useState<IOrganizerDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const organizerId = organizer?.id;

  // For showing selected range in UI
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(undefined);

  // For actual API calls
  const [filters, setFilters] = useState<{ from?: string; to?: string }>({});

  const fetchDetails = async (f?: { from?: string; to?: string }) => {
    if (!organizerId) return;

    try {
      setLoading(true);

      const res = await organizerDashboardService.fetchDashboardDetails({
        from: f?.from,
        to: f?.to
      });
    console.log("ree", res)
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!organizerId) return;
    fetchDetails(filters);
  }, [organizerId]);

  const onDateChange = (range: DateRange | undefined) => {
    setSelectedRange(range);

    const from = range?.from?.toISOString();
    const to = range?.to?.toISOString();

    const newFilters = { from, to };
    setFilters(newFilters);
    fetchDetails(newFilters);
  };

  const formattedRange = selectedRange?.from
    ? `${format(selectedRange.from, "dd MMM yyyy")}${
        selectedRange?.to ? ` → ${format(selectedRange.to, "dd MMM yyyy")}` : ""
      }`
    : "Last 30 days";

  if (loading) return <DashboardLoader />;
  if (!data)
    return <p className="text-center py-10 text-gray-500">Failed to load dashboard</p>;

  const { tickets, earnings, events, payouts, subscription, kyc } = data;

  // ------------------------------
  // COMPUTED METRICS
  // ------------------------------

  // Tickets sold today
  const today = new Date().toISOString().split("T")[0];
  const ticketsToday =
    tickets.dailyTrend.find((t) => t.date === today)?.tickets || 0;

  // Top 5 events
  const topEvents = [...events.data]
    .sort((a, b) => b.ticketsSold - a.ticketsSold)
    .slice(0, 5);

  // Next payout date
  const nextPayout = payouts.data
    .filter((p) => p.payoutStatus === "pending" && p.payoutDueDate)
    .sort(
      (a, b) =>
        new Date(a.payoutDueDate!).getTime() -
        new Date(b.payoutDueDate!).getTime()
    )[0];

  // Lifetime earnings
  // const lifetimeEarnings = earnings.organizerEarnings;

  // Revenue by event chart
  const revenueChartData = events.data.map((ev) => ({
    name: ev.eventTitle,
    gross: ev.grossRevenue,
    net: ev.netRevenue
  }));

  const refundChartData = events.data.map((ev) => ({
    name: ev.eventTitle,
    refunds: ev.refundedAmount
  }));

  return (
    <div className="space-y-8">

      {/* ---------------- DATE FILTER HEADER ---------------- */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Organizer Dashboard</h2>
            <div className="text-sm text-muted-foreground mt-1">
              Showing: <span className="font-medium">{formattedRange}</span>
            </div>
          </div>

          <DatePickerWithRange value={selectedRange} onChange={onDateChange} />
        </CardContent>
      </Card>

     {/* ---------------- SUMMARY CARDS (COMBINED & BEAUTIFIED) ---------------- */}
{/* ---------------- SUMMARY CARDS (DYNAMIC DATA) ---------------- */}  
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

  {/* ✅ Ticket Sales Overview */}
  <MetricCard
    title="Ticket Sales Overview"
    icon="ticket"
    headerColor="text-blue-600"
    metrics={[
      {
        label: "Total Tickets Sold",
        value: tickets.totalTicketsSold,
        icon: "ticket",
        color: "text-blue-500"
      },
      {
        label: "Tickets Sold Today",
        value: ticketsToday,
        icon: "bolt",
        color: "text-indigo-600"
      }
    ]}
  />

  {/* ✅ Revenue Summary */}
  <MetricCard
    title="Revenue Summary"
    icon="revenue"
    headerColor="text-green-600"
    metrics={[
      {
        label: "Total Earnings",
        value: `₹${earnings.organizerEarnings}`,
        icon: "rupee",
        color: "text-green-600"
      },
      {
        label: "Net Revenue",
        value: `₹${earnings.netRevenue}`,
        icon: "trendingUp",
        color: "text-emerald-600"
      },
      {
        label: "Refunds",
        value: `₹${earnings.refundedAmount}`,
        icon: "refund",
        color: "text-red-500"
      }
    ]}
  />

  {/* ✅ Payout Overview */}
  <MetricCard
    title="Payout Overview"
    icon="payout"
    headerColor="text-purple-600"
    metrics={[
      {
        label: "Pending Payout",
        value: `₹${payouts.totalPendingAmount}`,
        icon: "clock",
        color: "text-orange-600"
      },
      {
        label: "Paid Payout",
        value: `₹${payouts.totalPaidAmount}`,
        icon: "checkCircle",
        color: "text-green-600"
      },
      {
        label: "Next Payout Date",
        value: nextPayout?.payoutDueDate
          ? format(new Date(nextPayout.payoutDueDate), "dd MMM yyyy")
          : "—",
        icon: "calendar",
        color: "text-purple-600"
      }
    ]}
  />
</div>


      {/* ---------------- TOP 5 EVENTS ---------------- */}
    <Card className="border-none shadow-2xl rounded-2xl">
  <CardContent className="p-5">
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-xl font-semibold text-gray-800">Top 5 Events</h3>

      {/* Icon bubble */}
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-6h6v6m-7 4h8a2 2 0 002-2V7a2 2 0 00-2-2h-3l-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    {/* List */}
    <ul className="space-y-3">
      {topEvents.map((ev, index) => (
        <li
          key={ev.eventId}
          className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-200 shadow-sm"
        >
          {/* Left section */}
          <div className="flex items-center gap-4">
            {/* Rank Circle */}
            <div
              className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-full text-white shadow-md
                ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                    : index === 1
                    ? "bg-gradient-to-br from-gray-300 to-gray-500"
                    : index === 2
                    ? "bg-gradient-to-br from-amber-600 to-amber-800"
                    : "bg-gradient-to-br from-blue-500 to-blue-700"
                }`}
            >
              {index + 1}
            </div>

            {/* Event Title + Subtext */}
            <div className="flex flex-col">
              <span className="font-medium text-gray-800">{ev.eventTitle}</span>
              <span className="text-xs text-gray-500">Event Performance</span>
            </div>
          </div>

          {/* Tickets Sold */}
          <div className="flex items-center gap-2 font-semibold text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>

            <span>{ev.ticketsSold} tickets</span>
          </div>
        </li>
      ))}
    </ul>
  </CardContent>
</Card>


      {/* ---------------- CHART 1: TICKET SALES TREND ---------------- */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Ticket Sales Trend</h3>

          <ChartWrapper>
            <LineChart data={tickets.dailyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tickets" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ChartWrapper>
        </CardContent>
      </Card>

      {/* ---------------- CHART 2: EARNINGS TREND ---------------- */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Earnings Trend</h3>

          <ChartWrapper>
            <LineChart data={earnings.dailyRevenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ChartWrapper>
        </CardContent>
      </Card>

      {/* ---------------- CHART 3: REVENUE BY EVENT ---------------- */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Revenue by Event</h3>

          <ChartWrapper>
            <BarChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="gross" fill="#4f46e5" />
              <Bar dataKey="net" fill="#10b981" />
            </BarChart>
          </ChartWrapper>
        </CardContent>
      </Card>

      {/* ---------------- CHART 4: REFUNDS BY EVENT ---------------- */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Refunds by Event</h3>

          <ChartWrapper>
            <BarChart data={refundChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-20} textAnchor="end" interval={0} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="refunds" fill="#ef4444" />
            </BarChart>
          </ChartWrapper>
        </CardContent>
      </Card>

               {/* ---------------- KYC & SUBSCRIPTION ---------------- */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

  {/* KYC STATUS CARD */}
  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg">KYC Verification</h3>

      <p className="mt-2 text-sm">
        Status: <b>{kyc.kycStatus}</b>
      </p>

      <p className="text-sm text-gray-500">
        Resubmitted: {kyc.isKycResubmitted ? "Yes" : "No"}
      </p>

      <h4 className="mt-4 text-sm font-semibold">Documents</h4>
      <ul className="text-sm mt-2 space-y-1">
        {kyc.documents.map((doc, i) => (
          <li key={i} className="flex justify-between">
            <span>• {doc.type}</span>
            <span
              className={
                doc.status === "Approved"
                  ? "text-green-600"
                  : doc.status === "Rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }
            >
              {doc.status}
            </span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>

  {/* SUBSCRIPTION SUMMARY */}
  <Card>
    <CardContent className="p-4">
      <h3 className="font-semibold text-lg">Subscription Plan</h3>

      {subscription ? (
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <b>{subscription.planName}</b> — ₹{subscription.price}
          </p>
          <p>
            Valid: {subscription.startDate} → {subscription.endDate}
          </p>
          <p className="text-green-600 font-semibold">
            {subscription.isActive ? "Active" : "Expired"}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 mt-3 text-sm">No active subscription</p>
      )}
    </CardContent>
  </Card>

</div>


    {/* ---------------- EVENT PERFORMANCE TABLE ---------------- */}
<Card>
  <CardContent className="p-4">
    <h3 className="text-lg font-bold mb-3">Event Performance</h3>

    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Event</th>
            <th className="p-3 text-left">Tickets</th>
            <th className="p-3 text-left">Gross</th>
            <th className="p-3 text-left">Refunds</th>
            <th className="p-3 text-left">Net</th>
            <th className="p-3 text-left">Organizer Revenue</th>
            <th className="p-3 text-left">Platform Fee</th>
            <th className="p-3 text-left">Payout Pending</th>
            <th className="p-3 text-left">Payout Received</th>
          </tr>
        </thead>

        <tbody>
          {events.data.map((ev) => (
            <tr key={ev.eventId} className="border-b hover:bg-gray-50">
              <td className="p-3">{ev.eventTitle}</td>

              <td className="p-3">{ev.ticketsSold}</td>

              <td className="p-3">₹{ev.grossRevenue}</td>

              <td className="p-3 text-red-600">₹{ev.refundedAmount}</td>

              <td className="p-3 text-emerald-600">₹{ev.netRevenue}</td>

              <td className="p-3 text-blue-600 font-semibold">
                ₹{ev.organizerRevenue}
              </td>

              <td className="p-3 text-purple-600 font-semibold">
                ₹{ev.platformFee}
              </td>

              <td className="p-3">
                  ₹{ev.payoutPending}
              </td>
              <td className="p-3">
                  ₹{ev.payoutReceived}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </CardContent>
</Card>


    </div>
  );
}

/* --------------------------------------
   Reusable UI Components
--------------------------------------- */

import {
  Ticket,
  TrendingUp,
  Wallet,
  Calendar,
  CheckCircle,
  Clock,
  IndianRupee,
  ArrowDownCircle,
  Bolt
} from "lucide-react";
import type { ComponentType } from "react";


type HeaderIconType = "ticket" | "revenue" | "payout";

type MetricIconType =
  | "ticket"
  | "rupee"
  | "refund"
  | "trendingUp"
  | "bolt"
  | "checkCircle"
  | "clock"
  | "calendar";

interface MetricItem {
  label: string;
  value: string | number;
  icon: MetricIconType;
  color: string;
}

interface MetricCardProps {
  title: string;
  icon: HeaderIconType;
  headerColor?: string; // controls main big icon color
  metrics: MetricItem[];
}

/* --------------------------------------
   STRICTLY TYPED ICON MAPS (NO ANY)
--------------------------------------- */

const HeaderIconMap: Record<HeaderIconType, ComponentType<{ className?: string }>> = {
  ticket: Ticket,
  revenue: TrendingUp,
  payout: Wallet
};

const ItemIconMap: Record<MetricIconType, ComponentType<{ className?: string }>> = {
  ticket: Ticket,
  rupee: IndianRupee,
  refund: ArrowDownCircle,
  trendingUp: TrendingUp,
  bolt: Bolt,
  checkCircle: CheckCircle,
  clock: Clock,
  calendar: Calendar
};

/* --------------------------------------
   METRIC CARD — FINAL VERSION
--------------------------------------- */

export function MetricCard({
  title,
  icon,
  metrics,
  headerColor = "text-primary"
}: MetricCardProps) {
  const HeaderIcon = HeaderIconMap[icon];

  return (
    <Card className="shadow-sm border rounded-xl transition hover:shadow-md">
      <CardContent className="p-5">

        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`p-2 rounded-full 
            ${headerColor.replace("text-", "bg-")}/10`}
          >
            <HeaderIcon className={`h-5 w-5 ${headerColor}`} />
          </div>

          <h3 className="font-semibold text-lg">{title}</h3>
        </div>

        {/* METRICS */}
        <div className="space-y-3">
          {metrics.map((m, i) => {
            const Icon = ItemIconMap[m.icon];
            return (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${m.color}`} />
                  <span className="text-sm text-muted-foreground">
                    {m.label}
                  </span>
                </div>
                <span className="font-semibold">{m.value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}



function ChartWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function DashboardLoader() {
  return (
    <div className="grid grid-cols-1 gap-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
}


