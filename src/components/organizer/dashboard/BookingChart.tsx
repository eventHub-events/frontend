// charts/BookingChart.tsx
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface Props {
  data: {
    dateLabel: string;
    bookingsCount: number;
  }[];
}

export default function BookingChart({ data }: Props) {
  console.log("data",  data)
  return (
    <div className="bg-white p-4 rounded-xl border">
      <h3 className="font-semibold mb-2">Bookings Trend</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="dateLabel" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="bookingsCount"
            fill="#10b981"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
