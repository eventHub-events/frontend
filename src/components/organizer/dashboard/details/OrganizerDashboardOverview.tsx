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

import { LayoutDashboard, CalendarRange } from "lucide-react";
import {
  

  Percent,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  FileText,
 
 
 Crown,
 
  XCircle,
  RefreshCcw
  
} from "lucide-react";


const kycStatusMeta = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return {
        label: "Approved",
        icon: ShieldCheck,
        className: "bg-emerald-50 text-emerald-600"
      };
    case "rejected":
      return {
        label: "Rejected",
        icon: ShieldAlert,
        className: "bg-red-50 text-red-600"
      };
    case "pending":
    default:
      return {
        label: "Pending",
        icon: ShieldQuestion,
        className: "bg-yellow-50 text-yellow-600"
      };
  }
};

const documentMeta = (status: string) => {
  switch (status) {
    case "Approved":
      return {
        icon: CheckCircle,
        className: "text-emerald-600"
      };
    case "Rejected":
      return {
        icon: XCircle,
        className: "text-red-600"
      };
    default:
      return {
        icon: Clock,
        className: "text-yellow-600"
      };
  }
};


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
     <Card className="border border-gray-200 shadow-sm bg-white">
  <CardContent className="p-6">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

      {/* LEFT: TITLE + RANGE */}
      <div className="flex items-start gap-4">

        {/* Icon */}
        <div className="
          w-12 h-12 rounded-2xl
          bg-gradient-to-br from-indigo-500 to-purple-600
          text-white flex items-center justify-center
          shadow-md
        ">
          <LayoutDashboard size={22} />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Organizer Dashboard
          </h2>

          <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
            <CalendarRange size={14} />
            <span>
              Showing data for
              <span className="font-medium text-gray-700 ml-1">
                {formattedRange}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: DATE PICKER */}
      <div className="flex items-center gap-2">
        <DatePickerWithRange
          value={selectedRange}
          onChange={onDateChange}
        />
      </div>

    </div>
  </CardContent>
</Card>

  <OrganizerProfileQuickCard />
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
  <Card className="border border-gray-200 shadow-sm bg-white">
  <CardContent className="p-6 space-y-5">

    {/* ===== HEADER ===== */}
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
        <ShieldCheck size={22} />
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-gray-900">
          KYC Verification
        </h3>
        <p className="text-sm text-gray-500">
          Identity and document verification status
        </p>
      </div>
    </div>

    {/* ===== STATUS ===== */}
    {(() => {
      const meta = kycStatusMeta(kyc.kycStatus);
      const Icon = meta.icon;

      return (
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${meta.className}`}
          >
            <Icon size={16} />
            {meta.label}
          </span>

          {kyc.isKycResubmitted && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium">
              <RefreshCcw size={12} />
              Resubmitted
            </span>
          )}
        </div>
      );
    })()}

    {/* ===== DOCUMENTS ===== */}
    <div className="pt-2">
      <h4 className="text-sm font-semibold text-gray-700 mb-3">
        Submitted Documents
      </h4>

      <ul className="space-y-2">
        {kyc.documents.map((doc, i) => {
          const meta = documentMeta(doc.status);
          const Icon = meta.icon;

          return (
            <li
              key={i}
              className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition"
            >
              {/* Document Name */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <FileText size={16} className="text-gray-600" />
                </div>
                <span className="font-medium text-gray-900">
                  {doc.type}
                </span>
              </div>

              {/* Status */}
              <div className={`flex items-center gap-1 font-medium ${meta.className}`}>
                <Icon size={14} />
                {doc.status}
              </div>
            </li>
          );
        })}
      </ul>
    </div>

  </CardContent>
</Card>

  {/* SUBSCRIPTION SUMMARY */}
  <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all">
  <CardContent className="p-6 space-y-5">

    {/* ===== HEADER ===== */}
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md">
        <Crown size={22} />
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-gray-900">
          Subscription Plan
        </h3>
        <p className="text-sm text-gray-500">
          Current plan and billing details
        </p>
      </div>
    </div>

    {/* ===== CONTENT ===== */}
    {subscription ? (
      <div className="space-y-4">

        {/* Plan Name + Price */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Plan</p>
            <p className="text-lg font-bold text-gray-900">
              {subscription.planName}
            </p>
          </div>

          <div className="flex items-center gap-1 text-lg font-bold text-emerald-600">
            <IndianRupee size={16} />
            {subscription.price}
          </div>
        </div>

        {/* Validity */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarRange size={14} />
          <p className="text-sm text-gray-600">
  {new Date(subscription.startDate).toLocaleDateString("en-IN")} →
  {new Date(subscription.endDate).toLocaleDateString("en-IN")}
</p>

        </div>

        {/* Status */}
        <div>
          {subscription.isActive ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-sm">
              <CheckCircle size={14} />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-600 font-semibold text-sm">
              <XCircle size={14} />
              Expired
            </span>
          )}
        </div>

      </div>
    ) : (
      <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
        <XCircle className="text-gray-400" size={18} />
        <p className="text-sm text-gray-500">
          No active subscription plan
        </p>
      </div>
    )}

  </CardContent>
</Card>

</div>


    {/* ---------------- EVENT PERFORMANCE TABLE ---------------- */}
<Card className="border border-gray-200 shadow-sm bg-white">
  <CardContent className="p-6 space-y-4">

    {/* ===== TABLE HEADER ===== */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-md">
        <TrendingUp size={20} />
      </div>

      <div>
        <h3 className="text-xl font-extrabold text-gray-900">
          Event Performance
        </h3>
        <p className="text-sm text-gray-500">
          Revenue, payouts, and ticket sales per event
        </p>
      </div>
    </div>

    {/* ===== TABLE ===== */}
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
          <tr>
            <th className="p-4 text-left">Event</th>
            <th className="p-4 text-center">Tickets</th>
            <th className="p-4 text-right">Gross</th>
            <th className="p-4 text-right">Refunds</th>
            <th className="p-4 text-right">Net</th>
            <th className="p-4 text-right">Organizer</th>
            <th className="p-4 text-right">Platform</th>
            <th className="p-4 text-right">Pending</th>
            <th className="p-4 text-right">Paid</th>
          </tr>
        </thead>

        <tbody>
          {events.data.map((ev) => (
            <tr
              key={ev.eventId}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Event */}
              <td className="p-4 font-semibold text-gray-900">
                {ev.eventTitle}
              </td>

              {/* Tickets */}
              <td className="p-4 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                  <Ticket size={14} />
                  {ev.ticketsSold}
                </span>
              </td>

              {/* Gross */}
              <td className="p-4 text-right font-medium text-gray-900">
                ₹{ev.grossRevenue}
              </td>

              {/* Refunds */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 text-red-600 font-medium">
                  <RefreshCcw size={14} />
                  ₹{ev.refundedAmount}
                </span>
              </td>

              {/* Net */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                  <TrendingUp size={14} />
                  ₹{ev.netRevenue}
                </span>
              </td>

              {/* Organizer Revenue */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 text-blue-600 font-semibold">
                  <Wallet size={14} />
                  ₹{ev.organizerRevenue}
                </span>
              </td>

              {/* Platform Fee */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 text-purple-600 font-semibold">
                  <Percent size={14} />
                  ₹{ev.platformFee}
                </span>
              </td>

              {/* Payout Pending */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 text-orange-600 font-medium">
                  <Clock size={14} />
                  ₹{ev.payoutPending}
                </span>
              </td>

              {/* Payout Received */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle size={14} />
                  ₹{ev.payoutReceived}
                </span>
              </td>
            </tr>
          ))}

          {!events.data.length && (
            <tr>
              <td
                colSpan={9}
                className="p-6 text-center text-gray-500"
              >
                No event performance data available
              </td>
            </tr>
          )}
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
import OrganizerProfileQuickCard from "./OrganizerProfileQuickCard";


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


