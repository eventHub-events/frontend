"use client";

import { useEffect, useState } from "react";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import Pagination from "@/components/ui/Pagination";

import {
  PayoutOverviewResult,
  PayoutRow,
  PayoutsFilter,
} from "@/interface/admin/finance-payout/payouts";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";

type TrendRange = "daily" | "monthly" | "yearly";

const initialFilters: PayoutsFilter = {
  page: 1,
  limit: 10,
  status: "",
  organizerName: "",
  eventTitle: "",
  paymentMethod: "",
};

export default function PayoutsPage() {
  const [overview, setOverview] = useState<PayoutOverviewResult | null>(null);
  const [filters, setFilters] = useState<PayoutsFilter>(initialFilters);
  const [rows, setRows] = useState<PayoutRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [trendRange, setTrendRange] = useState<TrendRange>("daily");

  // ---------- Fetch overview ----------
  const fetchOverview = async (from?: string, to?: string) => {
    try {
      const res = await adminFinanceOverviewService.fetchPayoutOverview({ from, to });
      console.log("resssswee", res)
      setOverview(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- Fetch table ----------
  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const res = await adminFinanceOverviewService.fetchPayouts(filters);
      console.log("ressssst", res)
      const result = res.data.data;
      setRows(result.data);
      setTotalPages(result.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchOverview();
  }, []);

  // refetch payouts on filters change
  useEffect(() => {
    fetchPayouts();
  }, [filters]);

  const onDateChange = (range: DateRange | undefined) => {
    const from = range?.from ? range.from.toISOString() : undefined;
    const to = range?.to ? range.to.toISOString() : undefined;

    setFilters((prev) => ({
      ...prev,
      from,
      to,
      page: 1,
    }));

    // also refetch overview based on this time range
    fetchOverview(from, to);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const chartData =
    !overview
      ? []
      : trendRange === "daily"
      ? overview.trend.daily
      : trendRange === "monthly"
      ? overview.trend.monthly
      : overview.trend.yearly;

  const xKey =
    trendRange === "daily"
      ? "date"
      : trendRange === "monthly"
      ? "month"
      : "year";

  return (
    <div className="space-y-8">
      {/* ---------- TOP: Overview cards + trend selector ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Overview cards */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Pending Payout</p>
              <p className="text-xl font-bold text-orange-600">
                ₹{overview?.totals.totalPendingPayout ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Amount yet to be paid to organizers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total Paid Payout</p>
              <p className="text-xl font-bold text-emerald-600">
                ₹{overview?.totals.totalPaidPayout ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Total paid to organizers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Pending Payouts</p>
              <p className="text-xl font-bold text-orange-500">
                {overview?.totals.pendingCount ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Bookings waiting for payout
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Paid Payouts</p>
              <p className="text-xl font-bold text-emerald-500">
                {overview?.totals.paidCount ?? 0}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                Completed payouts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trend selector */}
        <Card>
          <CardContent className="p-4 flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">Trend Range</p>
            <Select
              value={trendRange}
              onValueChange={(v) => setTrendRange(v as TrendRange)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {overview && (
              <p className="text-[11px] text-muted-foreground mt-2">
                From{" "}
                {format(new Date(overview.timeRange.from), "dd MMM yyyy")} to{" "}
                {format(new Date(overview.timeRange.to), "dd MMM yyyy")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ---------- Trend chart ---------- */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payout Trend</h3>
          {overview ? (
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey={xKey} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#22c55e"
                    name="Payout Amount"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          )}
        </CardContent>
      </Card>

      {/* ---------- Filters ---------- */}
      <Card>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Organizer name"
            value={filters.organizerName ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                organizerName: e.target.value,
                page: 1,
              }))
            }
          />
          <Input
            placeholder="Event title"
            value={filters.eventTitle ?? ""}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                eventTitle: e.target.value,
                page: 1,
              }))
            }
          />

          <Select
            value={filters.status ?? ""}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                status: val === "all" ? "" : (val as "pending" | "paid"),
                page: 1,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Payout status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentMethod ?? ""}
            onValueChange={(val) =>
              setFilters((prev) => ({
                ...prev,
                paymentMethod: val,
                page: 1,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              {/* add more if needed */}
            </SelectContent>
          </Select>

          <DatePickerWithRange onChange={onDateChange} />
        </CardContent>
      </Card>

      {/* ---------- Table ---------- */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    {[
                      "Booking ID",
                      "Event",
                      "Organizer",
                      "Payout Amount",
                      "Status",
                      "Payout Due",
                      "Payout Date",
                      "Payment Method",
                      "Payment ID",
                    ].map((title) => (
                      <th
                        key={title}
                        className="px-5 py-3 text-left font-semibold text-gray-700 border-b"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-8 text-center text-gray-500"
                      >
                        Loading...
                      </td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="py-8 text-center text-gray-500"
                      >
                        No payouts found
                      </td>
                    </tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.bookingId} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-xs text-gray-700">
                          {row.bookingId}
                        </td>
                        <td className="px-5 py-3 text-gray-900 font-medium">
                          {row.eventTitle}
                        </td>
                        <td className="px-5 py-3 text-gray-800">
                          {row.organizerName}
                        </td>
                        <td className="px-5 py-3 font-semibold text-emerald-700">
                          ₹{row.organizerAmount}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              row.payoutStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {row.payoutStatus}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-gray-700">
                          {row.payoutDueDate
                            ? format(new Date(row.payoutDueDate), "dd MMM yyyy")
                            : "-"}
                        </td>
                        <td className="px-5 py-3 text-gray-700">
                          {row.payoutDate
                            ? format(new Date(row.payoutDate), "dd MMM yyyy")
                            : "-"}
                        </td>
                        <td className="px-5 py-3 text-gray-700 capitalize">
                          {row.paymentMethod ?? "-"}
                        </td>
                        <td className="px-5 py-3 text-xs text-gray-600">
                          {row.paymentId ?? "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ---------- Pagination ---------- */}
      {rows.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={filters.page}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
