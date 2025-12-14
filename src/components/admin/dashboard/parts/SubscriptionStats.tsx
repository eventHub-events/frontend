"use client";

interface Props {
  data: {
    totalRevenue: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
  };
}

export default function SubscriptionStats({ data }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Subscriptions</h3>

      <div className="space-y-2 text-sm">
        <Stat label="Total Revenue" value={`₹${data.totalRevenue}`} />
        <Stat label="Total Subscriptions" value={data.totalSubscriptions} />
        <Stat label="Active Subscriptions" value={data.activeSubscriptions} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
