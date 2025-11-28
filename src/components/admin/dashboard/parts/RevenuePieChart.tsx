// src/components/admin/dashboard/charts/RevenuePieChart.tsx
"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

export default function RevenuePieChart({
  platform,
  organizer
}: {
  platform: number;
  organizer: number;
}) {
  const data = [
    { name: "Platform Revenue", value: platform },
    { name: "Organizer Revenue", value: organizer }
  ];

  const COLORS = ["#2563eb", "#16a34a"];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip />
        <Legend />

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
