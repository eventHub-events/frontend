// DashboardStats.tsx
export default function DashboardStats({ bookings }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Stat title="Total Revenue" value={`₹${bookings.totalRevenue}`} />
      <Stat title="Platform Revenue" value={`₹${bookings.platformRevenue}`} />
      <Stat title="Organizer Revenue" value={`₹${bookings.organizerRevenue}`} />
      <Stat title="Bookings" value={bookings.bookingsCount} />
    </div>
  );
}

function Stat({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
