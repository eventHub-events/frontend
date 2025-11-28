import CountUp from "react-countup";
import {
  Users,
  UserCheck,
  CalendarCheck,
  IndianRupee,
  Wallet,
  CreditCard,
  Activity
} from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
}

const iconMap = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes("user")) return Users;
  if (l.includes("organizer")) return UserCheck;
  if (l.includes("booking")) return CalendarCheck;
  if (l.includes("revenue")) return IndianRupee;
  if (l.includes("subscription")) return CreditCard;
  if (l.includes("payout")) return Wallet;
  return Activity;
};

export default function StatCard({ label, value, subLabel }: StatCardProps) {
  const Icon = iconMap(label);
  const isNumber = typeof value === "number";

  return (
    <div className="relative bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />

      <div className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Icon className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>

          <h2 className="text-2xl font-bold text-gray-900">
            {isNumber ? (
              <CountUp
                end={Number(value)}
                duration={1.2}
                separator=","
              />
            ) : (
              value
            )}
          </h2>

          {subLabel && (
            <p className="text-xs text-gray-400 mt-0.5">{subLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}
