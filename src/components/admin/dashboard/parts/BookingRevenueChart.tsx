// src/components/admin/dashboard/charts/BookingRevenueChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function BookingRevenueChart({
  data
}: {
  data: {
    dateLabel: string;
    totalRevenue: number;
    platformRevenue: number;
    organizerRevenue: number;
  }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Line type="monotone" dataKey="totalRevenue" stroke="#2563eb" />
        <Line type="monotone" dataKey="platformRevenue" stroke="#16a34a" />
        <Line type="monotone" dataKey="organizerRevenue" stroke="#dc2626" />
      </LineChart>
    </ResponsiveContainer>
  );
}
