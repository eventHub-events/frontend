"use client";

interface Props {
  data: {
    pendingAmount: number;
    pendingCount: number;
  };
}

export default function PayoutSummary({ data }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h3 className="font-semibold mb-3">Pending Payouts</h3>

      <div className="space-y-2 text-sm">
        <Stat label="Pending Amount" value={`₹${data.pendingAmount}`} />
        <Stat label="Pending Requests" value={data.pendingCount} />
      </div>

      {data.pendingCount > 0 && (
        <button
          className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 text-sm"
          onClick={() => window.location.href = "/admin/payouts"}
        >
          Review Payouts
        </button>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
