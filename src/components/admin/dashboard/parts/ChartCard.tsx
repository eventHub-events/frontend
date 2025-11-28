// src/components/admin/dashboard/ChartCard.tsx
export default function ChartCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="w-full h-72">{children}</div>
    </div>
  );
}
