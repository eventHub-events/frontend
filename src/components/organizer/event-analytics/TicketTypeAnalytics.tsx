"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  PieChart as PieIcon,
  BarChart3,
  
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Ticket,
  IndianRupee
} from "lucide-react";
import { TicketRevenue, ITicketTypePerformance } from "@/interface/common/event-analytics";

/* ---------------- TYPES ---------------- */

interface TicketTypeAnalyticsProps {
  ticketTypePerformance: ITicketTypePerformance[];
  ticketRevenueSplit: TicketRevenue[];
  topTicketType: ITicketTypePerformance | null;
}

/* ---------------- CONSTANTS ---------------- */

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626", "#9333ea"];

/* ---------------- COMPONENT ---------------- */

export function TicketTypeAnalytics({
  ticketTypePerformance,
  ticketRevenueSplit,
  topTicketType
}: TicketTypeAnalyticsProps) {
  return (
    <div className="space-y-8">

      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Top Ticket Type"
          value={topTicketType?.ticketType ?? "—"}
          icon={Ticket}
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-700"
        />

        <SummaryCard
          title="Tickets Sold"
          value={topTicketType?.ticketsSold ?? 0}
          icon={TrendingUp}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
        />

        <SummaryCard
          title="Revenue"
          value={`₹${topTicketType?.revenue ?? 0}`}
          icon={IndianRupee}
          gradient="bg-gradient-to-br from-orange-500 to-orange-700"
        />
      </div>

      {/* ===== CHART + TABLE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* PIE CHART */}
       <Card className="shadow-md hover:shadow-lg transition-all">
  <CardContent className="p-6 space-y-4">

    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <PieIcon size={18} />
        </div>
        <h3 className="font-semibold text-lg">
          Revenue Distribution
        </h3>
      </div>
    </div>

    {/* Chart */}
    <div className="h-[300px] bg-gray-50 rounded-xl p-4">
      <ResponsiveContainer width="100%" height="100%">
         {/* Legend */}
<div className="grid grid-cols-2 gap-3 pt-2">
  {ticketRevenueSplit.map((item, index) => (
    <div
      key={item.name}
      className="flex items-center justify-between text-sm"
    >
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: COLORS[index % COLORS.length] }}
        />
        <span className="text-gray-700 font-medium">
          {item.name}
        </span>
      </div>

      <span className="font-semibold text-gray-900">
        ₹{item.value}
      </span>
    </div>
  ))}
</div>

        <PieChart>
          <Pie
            data={ticketRevenueSplit}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={65}
            paddingAngle={3}
          >
            {ticketRevenueSplit.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>

  </CardContent>
</Card>


        {/* TABLE */}
      <Card className="shadow-md hover:shadow-lg transition-all">
  <CardContent className="p-6 space-y-4">

    {/* Header */}
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
        <BarChart3 size={18} />
      </div>
      <h3 className="font-semibold text-lg">
        Ticket Performance
      </h3>
    </div>

    {/* Table */}
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="p-4 text-left">Ticket Type</th>
            <th className="p-4 text-center">Sold</th>
            <th className="p-4 text-right">Revenue</th>
          </tr>
        </thead>

        <tbody>
          {ticketTypePerformance.map((t, index) => (
            <tr
              key={t.ticketType}
              className="border-t hover:bg-gray-50 transition"
            >
              {/* Ticket Type */}
              <td className="p-4 flex items-center gap-3 font-medium">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                />
                {t.ticketType}
              </td>

              {/* Sold */}
              <td className="p-4 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                  <Ticket size={14} />
                  {t.ticketsSold}
                </span>
              </td>

              {/* Revenue */}
              <td className="p-4 text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
                  <IndianRupee size={14} />
                  {t.revenue}
                </span>
              </td>
            </tr>
          ))}

          {!ticketTypePerformance.length && (
            <tr>
              <td
                colSpan={3}
                className="p-6 text-center text-muted-foreground"
              >
                No ticket data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  </CardContent>
</Card>


      </div>
    </div>
  );
}



/* ---------------- SMALL CARD ---------------- */

function SummaryCard({
  title,
  value,
  icon: Icon,
  gradient
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  gradient: string;
}) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all">
      <CardContent className="p-5 flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${gradient}`}
        >
          <Icon size={22} />
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-0.5">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

