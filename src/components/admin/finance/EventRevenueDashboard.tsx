"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Legend, CartesianGrid
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";



import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import Pagination from "@/components/ui/Pagination";
import { DateRange } from "react-day-picker";
// import { format } from "date-fns";
import { IEventRevenueResult, IEventRevenueRow } from "@/interface/admin/finance-payout/event-summary";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";


function currency(n: number) {
  return `₹${n?.toLocaleString()}`;
}

export default function EventRevenueDashboard() {
  const [rows, setRows] = useState<IEventRevenueRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    eventTitle: "",
    organizerName: "",
    page: 1,
    limit: 10,
    from: "",
    to: ""
  });
  const [totalPages, setTotalPages] = useState(1);

  const [timeRange, setTimeRange] =
    useState<{ from?: string; to?: string } | null>(null);

  const [error, setError] = useState<string | null>(null);

  // --------------------------------
  // Fetch Revenue (supports filtering)
  // --------------------------------
  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await adminFinanceOverviewService.fetchEventRevenue({
        eventTitle: filters.eventTitle,
        organizerName: filters.organizerName,
        from: filters.from,
        to: filters.to,
        page: filters.page,
        limit: filters.limit
      });
 
       console.log("rseseses", res)
      const payload = res.data.data as IEventRevenueResult;
      setRows(payload.data ?? []);
      setTimeRange(payload.timeRange ?? null);

      setTotalPages(payload.totalPages ?? 1);

    } catch (err) {
      console.error(err);
      setError("Failed to load event revenue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [filters.page, filters.eventTitle, filters.organizerName, filters.from, filters.to]);

  // --------------------------------
  // Chart Data
  // --------------------------------
  const revenueByEvent = useMemo(
    () => rows.map((r) => ({ name: r.eventTitle, revenue: r.grossRevenue })),
    [rows]
  );

  const ticketsByEvent = useMemo(
    () => rows.map((r) => ({ name: r.eventTitle, tickets: r.ticketsSold })),
    [rows]
  );

  const netRevenueByEvent = useMemo(
    () => rows.map((r) => ({ name: r.eventTitle, net: r.netRevenue })),
    [rows]
  );

  const multiSeries = useMemo(
    () =>
      rows.map((r) => ({
        name: r.eventTitle,
        gross: r.grossRevenue,
        refunds: r.refundedAmount,
        commission: r.platformRevenue,
        organizer: r.organizerRevenue
      })),
    [rows]
  );

  // const hasData = rows.length > 0;

  const onDateChange = (range: DateRange | undefined) => {
    const from = range?.from ? range.from.toISOString() : "";
    const to = range?.to ? range.to.toISOString() : "";

    setFilters((prev) => ({ ...prev, from, to, page: 1 }));
  };

  return (
    <div className="space-y-8">

      {/* ---------------------------- HEADER ---------------------------- */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event — Revenue Summary</h2>
        {timeRange?.from && timeRange?.to ? (
          <div className="text-sm text-muted-foreground">
            {new Date(timeRange.from).toLocaleDateString()} →
            {new Date(timeRange.to).toLocaleDateString()}
          </div>
        ) : null}
      </div>

      {error && <div className="text-red-600">{error}</div>}

      {/* ---------------------------- TOP CARDS ---------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent>
          <p className="text-sm text-muted-foreground">Total Events</p>
          <h3 className="text-xl font-bold">{rows.length}</h3>
        </CardContent></Card>

        <Card><CardContent>
          <p className="text-sm text-muted-foreground">Total Gross Revenue</p>
          <h3 className="text-xl font-bold text-emerald-600">
            {currency(rows.reduce((s, r) => s + (r.grossRevenue || 0), 0))}
          </h3>
        </CardContent></Card>

        <Card><CardContent>
          <p className="text-sm text-muted-foreground">Total Refunds</p>
          <h3 className="text-xl font-bold text-rose-600">
            {currency(rows.reduce((s, r) => s + (r.refundedAmount || 0), 0))}
          </h3>
        </CardContent></Card>

        <Card><CardContent>
          <p className="text-sm text-muted-foreground">Total Net Revenue</p>
          <h3 className="text-xl font-bold text-sky-600">
            {currency(rows.reduce((s, r) => s + (r.netRevenue || 0), 0))}
          </h3>
        </CardContent></Card>
      </div>

      {/* ---------------------------- CHARTS ---------------------------- */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Chart 1 */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Revenue by Event</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis />
                  <Tooltip formatter={(v: number | undefined) => currency(v ?? 0)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0ea5a3" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2 */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Tickets Sold</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketsByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="tickets" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 3 */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Net Revenue</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={netRevenueByEvent}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="net" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 4 */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Revenue Breakdown</h3>
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={multiSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} />
                  <YAxis />
                 <Tooltip formatter={(v: number | undefined) => currency(v ?? 0)} />
                  <Legend />
                  <Bar dataKey="gross" fill="#4f46e5" />
                  <Bar dataKey="refunds" fill="#ef4444" />
                  <Bar dataKey="commission" fill="#f59e0b" />
                  <Bar dataKey="organizer" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>


      {/* ---------------------------- FILTERS ---------------------------- */}

      <Card>
        <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <Input
            placeholder="Search Event Title"
            value={filters.eventTitle}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, eventTitle: e.target.value, page: 1 }))
            }
          />

          <Input
            placeholder="Organizer Name"
            value={filters.organizerName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, organizerName: e.target.value, page: 1 }))
            }
          />

          <DatePickerWithRange onChange={onDateChange} />

        </CardContent>
      </Card>


      {/* ---------------------------- TABLE ---------------------------- */}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Event",
                    "Organizer",
                    "Tickets",
                    "Gross",
                    "Commission",
                    "Organizer Amount",
                    "Refunds",
                    "Net Revenue"
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
                  <tr><td colSpan={8} className="py-8 text-center">Loading...</td></tr>
                ) : rows.length === 0 ? (
                  <tr><td colSpan={8} className="py-8 text-center">No events found</td></tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.eventId} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium">{row.eventTitle}</td>
                      <td className="px-5 py-3">{row.organizerName}</td>
                      <td className="px-5 py-3">{row.ticketsSold}</td>
                      <td className="px-5 py-3">{currency(row.grossRevenue)}</td>
                      <td className="px-5 py-3">{currency(row.platformRevenue)}</td>
                      <td className="px-5 py-3">{currency(row.organizerRevenue)}</td>
                      <td className="px-5 py-3 text-rose-600">{currency(row.refundedAmount)}</td>
                      <td className="px-5 py-3 text-emerald-700 font-semibold">
                        {currency(row.netRevenue)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ---------------------------- PAGINATION ---------------------------- */}

      <Pagination
        totalPages={totalPages}
        currentPage={filters.page}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  );
}
