// src/components/admin/dashboard/charts/BookingCountChart.tsx
"use client";

import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer
} from "recharts";

export default function BookingCountChart({
  data
}: {
  data: { dateLabel: string; bookingsCount: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" />
        <YAxis />
        <Tooltip />

        <Line type="monotone" dataKey="bookingsCount" stroke="#9333ea" />
      </LineChart>
    </ResponsiveContainer>
  );
}
