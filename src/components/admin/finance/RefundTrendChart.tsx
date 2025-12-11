"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

import {
  RefundOverviewResult,
  RefundTrendRange
} from "@/interface/admin/finance-payout/refund";
import { adminFinanceOverviewService } from "@/services/admin/adminFinanceOverviewService";

export default function RefundTrendChart() {
  const [overview, setOverview] = useState<RefundOverviewResult | null>(null);

  const [range, setRange] = useState<RefundTrendRange>("daily");

   const fetchOverview = async () => {
      try {
        const res = await adminFinanceOverviewService.fetchRefundsOverview();
        console.log("res" ,res)
        setOverview(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
      fetchOverview();
  }, []);

  if (!overview) return <p>Loading...</p>;

  // Pick dataset based on selected range
  const chartData =
    range === "daily"
      ? overview.trend.daily
      : range === "monthly"
      ? overview.trend.monthly
      : overview.trend.yearly;

  // Choose proper X-axis key based on type
  const xKey: "date" | "month" | "year" =
    range === "daily" ? "date" : range === "monthly" ? "month" : "year";

  return (
    <div className="w-full h-80 bg-white shadow rounded-lg p-4">

      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Refund Trend</h3>

        <Select
          value={range}
          onValueChange={(v: RefundTrendRange) => setRange(v)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#f87171"
            name="Amount Refunded"
            strokeWidth={2}
          />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#60a5fa"
            name="Refund Count"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
