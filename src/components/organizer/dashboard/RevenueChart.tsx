// charts/RevenueChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  data: {
    dateLabel: string;
    revenue: number;
  }[];
}

export default function RevenueChart({ data }: Props) {
  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3 className="font-semibold mb-2">Revenue Trend</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="dateLabel" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
             dataKey="revenue"
            stroke="#4f46e5"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
