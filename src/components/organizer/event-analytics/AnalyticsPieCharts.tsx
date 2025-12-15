import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#2563eb", "#16a34a", "#f97316", "#dc2626"];

interface Props {
  paymentSplit: { method: string; amount: number }[];
  refundSplit: { status: string; refundedAmount: number }[];
}

export function AnalyticsPieCharts({ paymentSplit, refundSplit }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <PieCard title="Payment Method Split" data={paymentSplit} />
      <PieCard title="Refund Status Split" data={refundSplit} />
    </div>
  );
}

function PieCard({
  title,
  data
}: {
  title: string;
  data: { method: string; amount: number }[] | { status: string; refundedAmount: number }[] ;
}) {
  return (
    <div className="border rounded-xl p-4">
      <h3 className="font-semibold mb-3">{title}</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />

            {/* Legend at bottom */}
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

