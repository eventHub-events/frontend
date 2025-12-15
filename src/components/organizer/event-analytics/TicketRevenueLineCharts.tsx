import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

interface Props {
  ticketTrend: { date: string; value: number }[];
  revenueTrend: { date: string; value: number }[];
}

export function TicketRevenueLineCharts({ ticketTrend, revenueTrend }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <ChartCard title="Ticket Sales Trend">
        <LineChart data={ticketTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ChartCard>

      <ChartCard title="Revenue Trend">
        <LineChart data={revenueTrend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line dataKey="value" stroke="#16a34a" strokeWidth={2} />
        </LineChart>
      </ChartCard>
    </div>
  );
}

function ChartCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <h3 className="font-semibold mb-3">{title}</h3>

      {/* IMPORTANT: fixed height container */}
      <div className="relative h-[260px] min-h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

