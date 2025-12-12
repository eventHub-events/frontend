import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import {
  // Users,
  // UserCheck,
  // UserPlus,
  // BadgeCheck,
   TrendingUp,
  // Wallet,
  // Coins,
  // Crown,
  Layers,
} from "lucide-react";

interface StatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

interface GroupStatCardProps {
  title: string;
  icon?: ReactNode; // Main section icon
  stats: StatItem[];
}

export default function GroupStatCard({ title, icon, stats }: GroupStatCardProps) {
  return (
    <Card className="rounded-2xl border shadow-sm bg-white">
      <CardContent className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow">
            {icon ?? <Layers size={20} />}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
            {title}
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition shadow-sm flex flex-col gap-2 border"
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                    stat.color ?? "bg-blue-100 text-blue-700"
                  }`}
                >
                  {stat.icon ?? <TrendingUp size={18} />}
                </div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              </div>

              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
}
