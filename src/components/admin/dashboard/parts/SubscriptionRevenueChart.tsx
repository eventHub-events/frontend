// src/components/admin/dashboard/charts/SubscriptionRevenueChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function SubscriptionRevenueChart({
  data
}: {
  data: {
    dateLabel: string;
    revenue: number;
    subscriptions: number;
  }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dateLabel" />
        <YAxis />
        <Tooltip />
        <Legend />

        <Bar dataKey="revenue" fill="#3b82f6" />
        <Bar dataKey="subscriptions" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
