import { UserMetricsDTO } from "@/types/admin/dashboard";

interface UserSummaryProps {
  users: UserMetricsDTO;
}

export default function UserSummary({ users }: UserSummaryProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow space-y-2">
      <h3 className="font-semibold">Users</h3>
      <Stat label="Total Users" value={users.totalUsers} />
      <Stat label="Active Users" value={users.activeUsers} />
      <Stat label="Total Organizers" value={users.totalOrganizers} />
      <Stat label="Pending Verifications" value={users.pendingOrganizerVerification} />
    </div>
  );
}


/* ✅ Local helper */
function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}