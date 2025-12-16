import { Card, CardContent } from "@/components/ui/card";
import {
  Ticket,
  IndianRupee,
  TrendingUp,
  ArrowDownCircle,
  Wallet,
  Percent
} from "lucide-react";
import { EventAnalyticsSummary } from "@/interface/common/event-analytics";

interface Props {
  data: EventAnalyticsSummary;
}

export function AnalyticsSummaryCards({ data }: Props) {
  const cards = [
    {
      label: "Tickets Sold",
      value: data.ticketsSold,
      icon: Ticket,
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-50"
    },
    {
      label: "Gross Revenue",
      value: `₹${data.grossRevenue}`,
      icon: IndianRupee,
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-50"
    },
    {
      label: "Net Revenue",
      value: `₹${data.netRevenue}`,
      icon: TrendingUp,
      gradient: "from-teal-500 to-emerald-600",
      bg: "bg-teal-50"
    },
    {
      label: "Refunds",
      value: `₹${data.refundedAmount}`,
      icon: ArrowDownCircle,
      gradient: "from-rose-500 to-red-600",
      bg: "bg-rose-50"
    },
    {
      label: "Organizer Revenue",
      value: `₹${data.organizerRevenue}`,
      icon: Wallet,
      gradient: "from-indigo-500 to-purple-600",
      bg: "bg-indigo-50"
    },
    {
      label: "Platform Fee",
      value: `₹${data.platformFee}`,
      icon: Percent,
      gradient: "from-fuchsia-500 to-purple-600",
      bg: "bg-fuchsia-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {cards.map((c) => (
        <Card
          key={c.label}
          className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="p-6 flex items-center justify-between">
            {/* Left content */}
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                {c.label}
              </p>
              <p className="text-3xl font-extrabold text-gray-900 mt-1">
                {c.value}
              </p>
            </div>

            {/* Icon */}
            <div
              className={`
                w-14 h-14 rounded-2xl
                flex items-center justify-center
                bg-gradient-to-br ${c.gradient}
                text-white shadow-md
              `}
            >
              <c.icon size={26} />
            </div>
          </CardContent>

          {/* Subtle bottom accent */}
          <div className={`absolute inset-x-0 bottom-0 h-1 ${c.bg}`} />
        </Card>
      ))}
    </div>
  );
}
