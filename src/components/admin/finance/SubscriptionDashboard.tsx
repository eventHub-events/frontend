"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import Pagination from "@/components/ui/Pagination";

import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// import {
//   SubscriptionOverviewResult,
//   SubscriptionPlanRow,
//   SubscriptionPlansResult,
// } from "@/interface/admin/finance-payout/subscription";

import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";
import { SubscriptionOverviewResult, SubscriptionPlanPaginatedResult, SubscriptionPlanRow } from "@/interface/admin/finance-payout/subscription";

// ------------------------------ Helpers ------------------------------
type TrendRange = "daily" | "monthly" | "yearly";
const currency = (n: number) => `₹${n?.toLocaleString()}`;

// ====================================================================
//                     MAIN COMBINED COMPONENT
// ====================================================================

export default function SubscriptionDashboard() {
  // ------------------------- STATES -------------------------
  const [overview, setOverview] = useState<SubscriptionOverviewResult | null>(null);

  const [plans, setPlans] = useState<SubscriptionPlanRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    from: "",
    to: "",
    page: 1,
    limit: 10,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [trendRange, setTrendRange] = useState<TrendRange>("daily");

  // ------------------------- FETCH OVERVIEW -------------------------
  async function fetchOverview() {
    const res = await adminFinanceOverviewService.fetchSubscriptionOverview({
      from: filters.from,
      to: filters.to,
    });

    setOverview(res.data.data);
  }

  // ------------------------- FETCH PLANS -------------------------
  async function fetchPlans() {
    setLoading(true);
    try {
      const res = await adminFinanceOverviewService.fetchSubscriptionPlansRevenue(filters);
      const payload = res.data.data as SubscriptionPlanPaginatedResult;

      setPlans(payload.data);
      setTotalPages(payload.totalPages);
    } finally {
      setLoading(false);
    }
  }

  // ------------------------- EFFECTS -------------------------
  useEffect(() => {
    fetchOverview();
  }, [filters.from, filters.to]);

  useEffect(() => {
    fetchPlans();
  }, [filters]);

  // ------------------------- Trend Chart Data -------------------------
  const chartData =
    trendRange === "daily"
      ? overview?.trend.daily ?? []
      : trendRange === "monthly"
      ? overview?.trend.monthly ?? []
      : overview?.trend.yearly ?? [];

  const xKey =
    trendRange === "daily"
      ? "date"
      : trendRange === "monthly"
      ? "month"
      : "year";

  // ------------------------- Date Picker Handler -------------------------
  const onDateChange = (range: DateRange | undefined) => {
    const from = range?.from ? range.from.toISOString() : "";
    const to = range?.to ? range.to.toISOString() : "";

    setFilters((prev) => ({ ...prev, from, to, page: 1 }));
  };

  // ====================================================================
  //                             UI
  // ====================================================================
  return (
    <div className="space-y-10">

      {/* ====================================================== */}
      {/*                    PAGE HEADER                         */}
      {/* ====================================================== */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subscription Revenue Summary</h2>

        {overview?.timeRange && (
          <p className="text-sm text-muted-foreground">
            {format(new Date(overview.timeRange.from), "dd MMM yyyy")} →
            {format(new Date(overview.timeRange.to), "dd MMM yyyy")}
          </p>
        )}
      </div>

      {/* ====================================================== */}
      {/*                     OVERVIEW CARDS                     */}
      {/* ====================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <h3 className="text-xl font-bold text-emerald-600">
              {currency(overview?.totals.totalRevenue ?? 0)}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Active Subscribers</p>
            <h3 className="text-xl font-bold">
              {overview?.totals.activeSubscribers ?? 0}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Subscriptions</p>
            <h3 className="text-xl font-bold">
              {overview?.totals.totalSubscriptions ?? 0}
            </h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg Revenue / Subscription</p>
            <h3 className="text-xl font-bold text-indigo-600">
              {currency(
                (overview?.totals.totalRevenue ?? 0) /
                  (overview?.totals.totalSubscriptions || 1)
              )}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* ====================================================== */}
      {/*                     TREND CHART                        */}
      {/* ====================================================== */}
      <Card>
        <CardContent className="p-6">

          <div className="flex justify-between mb-4">
            <h3 className="font-semibold text-lg">Subscription Trend</h3>

            <select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value as TrendRange)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Revenue" />
                <Line type="monotone" dataKey="count" stroke="#6366f1" name="Subscriptions" />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/*                        FILTERS                         */}
      {/* ====================================================== */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Input
            placeholder="Search Plan Name"
            value={filters.name}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, name: e.target.value, page: 1 }))
            }
          />

          <DatePickerWithRange onChange={onDateChange} />

        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/*                        TABLE                           */}
      {/* ====================================================== */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200">

            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Plan",
                    "Price",
                    "Subscribers",
                    "Revenue",
                    "Avg Revenue / Subscriber",
                  ].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">Loading...</td>
                  </tr>
                ) : plans.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">No results</td>
                  </tr>
                ) : (
                  plans.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium">{p.name}</td>
                      <td className="px-5 py-3">{currency(p.price)}</td>
                      <td className="px-5 py-3">{p.subscribers}</td>
                      <td className="px-5 py-3 text-emerald-600">{currency(p.revenue)}</td>
                      <td className="px-5 py-3">{currency(p.avgRevenue)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

          </div>
        </CardContent>
      </Card>

      {/* ====================================================== */}
      {/*                    PAGINATION                          */}
      {/* ====================================================== */}
      <Pagination
        totalPages={totalPages}
        currentPage={filters.page}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />

    </div>
  );
}
