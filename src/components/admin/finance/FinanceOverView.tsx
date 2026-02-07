"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  DotProps,
} from "recharts";

import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";
import { FinanceOverviewResults } from "@/interface/admin/finance-payout/financeOverview";

// ---------------------- DOT COMPONENTS ----------------------
const RevenueDot = (props: DotProps) => {
  const { cx = 0, cy = 0, stroke } = props;
  return <circle cx={cx} cy={cy} r={5} fill={stroke} />;
};

const RevenueActiveDot = (props: DotProps) => {
  const { cx = 0, cy = 0, stroke } = props;
  return <circle cx={cx} cy={cy} r={7} fill={stroke} />;
};

const RefundDot = (props: DotProps) => {
  const { cx = 0, cy = 0, stroke } = props;
  return <circle cx={cx} cy={cy} r={5} fill={stroke} />;
};

const RefundActiveDot = (props: DotProps) => {
  const { cx = 0, cy = 0, stroke } = props;
  return <circle cx={cx} cy={cy} r={7} fill={stroke} />;
};

// ---------------------- TYPES ----------------------
type TrendType = "daily" | "monthly" | "yearly";

interface TrendDetails {
  pct: number | null;
  prevValue: number | null;
  label: string; // e.g. "from yesterday", "from previous 7 days"
}

// ---------------------- HELPERS: FILL MISSING DAILY ----------------------
function fillMissingDaysForTickets(
  data: { date: string; revenue: number; refunds: number }[],
  from: string | Date,
  to: string | Date
) {
  const result: { date: string; revenue: number; refunds: number }[] = [];
  const map = new Map(data.map((d) => [d.date, d]));

  const current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const existing = map.get(dateStr);

    result.push({
      date: dateStr,
      revenue: existing?.revenue ?? 0,
      refunds: existing?.refunds ?? 0,
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

function fillMissingDaysForSubscription(
  data: { date: string; revenue: number }[],
  from: string | Date,
  to: string | Date
) {
  const result: { date: string; revenue: number }[] = [];
  const map = new Map(data.map((d) => [d.date, d.revenue]));

  const current = new Date(from);
  const end = new Date(to);

  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];

    result.push({
      date: dateStr,
      revenue: map.get(dateStr) ?? 0,
    });

    current.setDate(current.getDate() + 1);
  }

  return result;
}

// ---------------------- DATE UTILS FOR LABELS ----------------------
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function stripTime(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isFullCalendarMonth(from: Date, to: Date): boolean {
  const f = stripTime(from);
  const t = stripTime(to);

  if (f.getFullYear() !== t.getFullYear()) return false;
  if (f.getMonth() !== t.getMonth()) return false;
  if (f.getDate() !== 1) return false;

  const lastDayOfMonth = new Date(f.getFullYear(), f.getMonth() + 1, 0).getDate();
  return t.getDate() === lastDayOfMonth;
}

function isFullCalendarYear(from: Date, to: Date): boolean {
  const f = stripTime(from);
  const t = stripTime(to);

  return (
    f.getFullYear() === t.getFullYear() &&
    f.getMonth() === 0 &&
    f.getDate() === 1 &&
    t.getMonth() === 11 &&
    t.getDate() === 31
  );
}

/**
 * Build a Stripe-style comparison label based on selected timeRange.
 * Examples:
 *  - "from yesterday"
 *  - "from previous 7 days"
 *  - "from last month"
 *  - "from last year"
 */
function getComparisonLabel(fromRaw: string | Date, toRaw: string | Date): string {
  const from = stripTime(new Date(fromRaw));
  const to = stripTime(new Date(toRaw));

  const diffMs = to.getTime() - from.getTime();
  const diffDays = Math.floor(diffMs / MS_PER_DAY) + 1; // inclusive days

  // 1-day range
  if (diffDays === 1) {
    return "from yesterday";
  }

  // Full month
  if (isFullCalendarMonth(from, to)) {
    return "from last month";
  }

  // Full year
  if (isFullCalendarYear(from, to)) {
    return "from last year";
  }

  // Generic multi-day custom range
  return `from previous ${diffDays} days`;
}

// ---------------------- TOTALS-BASED TREND ----------------------
function calculateTotalsTrend(
  current: number,
  previous: number | null | undefined,
  label: string
): TrendDetails {
  if (previous === null || previous === undefined) {
    return { pct: null, prevValue: null, label: "" };
  }

  if (previous === 0) {
    const pct = current === 0 ? 0 : 100;
    return {
      pct,
      prevValue: previous,
      label,
    };
  }

  const pct = ((current - previous) / previous) * 100;
  return {
    pct,
    prevValue: previous,
    label,
  };
}

// ---------------------- CONSTANTS ----------------------
const COLORS = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"];
const TREND_TABS: TrendType[] = ["daily", "monthly", "yearly"];

// ---------------------- MAIN COMPONENT ----------------------
export default function FinanceOverview() {
  const [data, setData] = useState<FinanceOverviewResults | null>(null);
  const [prevData, setPrevData] = useState<FinanceOverviewResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [trendType, setTrendType] = useState<TrendType>("daily");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ---------------------- LOAD DATA (current + previous period) ----------------------
  const loadData = async (from?: string, to?: string) => {
    setLoading(true);
    try {
      // 1) current period
      const res = await adminFinanceOverviewService.fetchOverView({ from, to });
      const current = res.data.data as FinanceOverviewResults;
      setData(current);

      // 2) previous period (same duration, shifted back)
      const start = new Date(current.timeRange.from);
      const end = new Date(current.timeRange.to);

      const startStripped = stripTime(start);
      const endStripped = stripTime(end);
      const diffMs = endStripped.getTime() - startStripped.getTime();

      if (diffMs >= 0) {
        const prevEndStripped = new Date(startStripped.getTime() - MS_PER_DAY);
        const prevStartStripped = new Date(prevEndStripped.getTime() - diffMs);

        try {
          const prevRes = await adminFinanceOverviewService.fetchOverView({
            from: prevStartStripped.toISOString(),
            to: prevEndStripped.toISOString(),
          });
          setPrevData(prevRes.data.data);
        } catch (err) {
          console.error("Failed to load previous period", err);
          setPrevData(null);
        }
      } else {
        setPrevData(null);
      }
    } catch (err) {
      console.error(err);
      setData(null);
      setPrevData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>No data available</p>;

  const { totals, subscription, payouts, trend, timeRange } = data;
  const prevTotals = prevData?.totals;
  const prevSubscription = prevData?.subscription;
  const prevPayouts = prevData?.payouts;

  // Shared comparison label for all KPI trends (A3-A)
  const comparisonLabel = getComparisonLabel(timeRange.from, timeRange.to);

  // X-axis key
  const xKey =
    trendType === "daily"
      ? "date"
      : trendType === "monthly"
      ? "month"
      : "year";

  // ---------------------- TICKET TREND (chart only) ----------------------
  let ticketTrend = trend[trendType] as {
    date?: string;
    month?: string;
    year?: string;
    revenue: number;
    refunds: number;
  }[];

  if (trendType === "daily") {
    ticketTrend = fillMissingDaysForTickets(
      ticketTrend as { date: string; revenue: number; refunds: number }[],
      timeRange.from,
      timeRange.to
    );
  }

  // ---------------------- SUBSCRIPTION TREND (chart only) ----------------------
  let subscriptionTrend: { date?: string; month?: string; year?: string; revenue: number }[] =
    trendType === "daily"
      ? trend.subscriptionDaily
      : trendType === "monthly"
      ? trend.subscriptionMonthly
      : trend.subscriptionYearly;

  if (trendType === "daily") {
    subscriptionTrend = fillMissingDaysForSubscription(
      subscriptionTrend as { date: string; revenue: number }[],
      timeRange.from,
      timeRange.to
    );
  }

  // ---------------------- KPI TREND DETAILS (ALL FROM TOTALS) ----------------------
  const grossTrendDetails = calculateTotalsTrend(
    totals.grossTicketSales,
    prevTotals?.grossTicketSales,
    comparisonLabel
  );

  const refundsTrendDetails = calculateTotalsTrend(
    totals.totalRefunds,
    prevTotals?.totalRefunds,
    comparisonLabel
  );

  const platformTrendDetails = calculateTotalsTrend(
    totals.platformRevenueFromTickets,
    prevTotals?.platformRevenueFromTickets,
    comparisonLabel
  );

  const organizerTrendDetails = calculateTotalsTrend(
    totals.organizerRevenueFromTickets,
    prevTotals?.organizerRevenueFromTickets,
    comparisonLabel
  );

  const subscriptionTrendDetails = calculateTotalsTrend(
    subscription.subscriptionRevenue,
    prevSubscription?.subscriptionRevenue,
    comparisonLabel
  );

  const pendingPayoutTrendDetails = calculateTotalsTrend(
    payouts.pendingPayoutAmount,
    prevPayouts?.pendingPayoutAmount,
    comparisonLabel
  );

  // Net Revenue = platform + subscription
  const netCurrent =
    totals.platformRevenueFromTickets + subscription.subscriptionRevenue;

  const netPrev =
    (prevTotals?.platformRevenueFromTickets ?? 0) +
    (prevSubscription?.subscriptionRevenue ?? 0);

  // If no prevData, treat as "no trend"
  const netTrendDetails = prevData
    ? calculateTotalsTrend(netCurrent, netPrev, comparisonLabel)
    : { pct: null, prevValue: null, label: "" };

  // ---------------------- PIE DATA ----------------------
  const bookingStatusData = [
    { name: "Confirmed", value: totals.confirmedBookings },
    { name: "Cancelled", value: totals.cancelledBookings },
    { name: "Failed", value: totals.failedPayments },
    { name: "Refunded", value: totals.refundedBookings },
  ];

  // =========================== UI ===========================
  return (
    <div className="space-y-10">
      {/* DATE FILTER */}
     {/* 🔥 Modern Filter Bar */}
<div
  className={`
    w-full rounded-2xl bg-white/70 backdrop-blur-md border shadow-sm 
    p-4 flex flex-wrap items-end gap-4 animate-fadeIn
  `}
>
  {/* FROM Date */}
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-500 mb-1">From</label>

    <div className="relative">
      <input
        type="date"
        className="
          pl-10 pr-3 py-2 rounded-xl border 
          bg-gray-50 hover:bg-gray-100 transition-all
          focus:ring-2 focus:ring-primary focus:border-primary
          text-sm
        "
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />

      {/* Calendar Icon */}
      <svg
        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm12-3v4m-6-4v4" />
      </svg>
    </div>
  </div>

  {/* TO Date */}
  <div className="flex flex-col">
    <label className="text-xs font-medium text-gray-500 mb-1">To</label>

    <div className="relative">
      <input
        type="date"
        className="
          pl-10 pr-3 py-2 rounded-xl border 
          bg-gray-50 hover:bg-gray-100 transition-all
          focus:ring-2 focus:ring-primary focus:border-primary
          text-sm
        "
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />

      {/* Calendar Icon */}
      <svg
        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm12-3v4m-6-4v4" />
      </svg>
    </div>
  </div>

  {/* APPLY FILTER BUTTON */}
  <Button
    disabled={!fromDate || !toDate}
    onClick={() => loadData(fromDate, toDate)}
    className="
      px-6 py-2 rounded-xl font-semibold
      bg-primary text-white shadow-md
      hover:shadow-lg hover:-translate-y-0.5
      transition-all
    "
  >
    Apply Filter
  </Button>
</div>


      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        <KpiCard
          title="Gross Ticket Sales"
          value={totals.grossTicketSales}
          trend={grossTrendDetails}
        />
        <KpiCard
          title="Total Refunds"
          value={totals.totalRefunds}
          trend={refundsTrendDetails}
        />
        <KpiCard
          title="Platform Revenue"
          value={totals.platformRevenueFromTickets}
          trend={platformTrendDetails}
        />
        <KpiCard
          title="Organizer Revenue"
          value={totals.organizerRevenueFromTickets}
          trend={organizerTrendDetails}
        />
        <KpiCard
          title="Subscription Revenue"
          value={subscription.subscriptionRevenue}
          trend={subscriptionTrendDetails}
        />
        <KpiCard
          title="Pending Payouts"
          value={payouts.pendingPayoutAmount}
          trend={pendingPayoutTrendDetails}
        />
        <KpiCard
          title="Net Revenue"
          value={netCurrent}
          trend={netTrendDetails}
        />
      </div>

      {/* TREND SWITCHER */}
      <div className="flex items-center gap-4">
        {TREND_TABS.map((tab) => (
          <Button
            key={tab}
            variant={trendType === tab ? "default" : "outline"}
            onClick={() => setTrendType(tab)}
          >
            {tab.toUpperCase()}
          </Button>
        ))}
      </div>

      {/* TICKET TREND CHART */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Revenue vs Refunds Trend ({trendType})
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={ticketTrend}>
              <XAxis dataKey={xKey} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
             <Tooltip formatter={(v: number | undefined) => `₹${v ?? 0}`} />


              <Line
                yAxisId="left"
                dataKey="revenue"
                stroke="#3b82f6"
                dot={<RevenueDot />}
                activeDot={<RevenueActiveDot />}
                name="Platform Revenue"
              />
              <Line
                yAxisId="right"
                dataKey="refunds"
                stroke="#ef4444"
                dot={<RefundDot />}
                activeDot={<RefundActiveDot />}
                name="Refunds"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* SUBSCRIPTION TREND CHART */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Subscription Revenue Trend ({trendType})
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={subscriptionTrend}>
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip formatter={(v: number | undefined) => `₹${v ?? 0}`} />

              <Line
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                dot
                name="Subscription Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* BOOKING STATUS PIE */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Booking Status Breakdown
          </h2>

          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={bookingStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                dataKey="value"
                label
              >
                {bookingStatusData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------------------- KPI CARD ----------------------
import {
  ArrowUpRight,
  ArrowDownRight,
  Ticket,
  RotateCcw,
  Banknote,
  Briefcase,
  CreditCard,
  Wallet,
  BarChart3,
   LucideIcon,
} from "lucide-react";

// Map titles → icons
const iconMap: Record<string, LucideIcon> = {
  "Gross Ticket Sales": Ticket,
  "Total Refunds": RotateCcw,
  "Platform Revenue": Banknote,
  "Organizer Revenue": Briefcase,
  "Subscription Revenue": CreditCard,
  "Pending Payouts": Wallet,
  "Net Revenue": BarChart3,
};
interface KpiCardProps {
  title: string;
  value: number;
  trend?: TrendDetails;
}

function KpiCard({ title, value, trend }: KpiCardProps) {
  const Icon = iconMap[title] ?? BarChart3;

  const hasTrend =
    trend && trend.pct !== null && trend.prevValue !== null;

  const isPositive = hasTrend && trend!.pct! >= 0;

  return (
    <div
      className="
        rounded-2xl border bg-white/70 backdrop-blur-lg
        shadow-sm hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 p-6
      "
    >
      {/* Header & Icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600 tracking-wide">
          {title}
        </p>

        {/* Gradient Icon Bubble */}
        <div
          className="
            w-12 h-12 rounded-xl 
            bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700
            shadow-md flex items-center justify-center
            animate-fadeIn
          "
        >
          <Icon size={22} className="text-white drop-shadow" />
        </div>
      </div>

      {/* Value */}
      <p className="text-4xl font-extrabold mt-4 text-gray-900 tracking-tight">
        ₹{value.toLocaleString()}
      </p>

      {/* Trend Section */}
      {hasTrend && (
        <div className="mt-3 space-y-1 animate-slideUp">
          <div
            className={`
              flex items-center gap-2 text-sm font-semibold
              ${isPositive ? "text-green-600" : "text-red-600"}
            `}
          >
            {isPositive ? (
              <ArrowUpRight size={18} className="animate-bounceUp" />
            ) : (
              <ArrowDownRight size={18} className="animate-bounceDown" />
            )}

            {isPositive ? "+" : ""}
            {trend!.pct!.toFixed(2)}%

            <span className="text-gray-400 text-xs ml-1 font-normal">
              {trend!.label}
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Prev: ₹{trend!.prevValue?.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
