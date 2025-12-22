"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign } from "lucide-react"; // icon

const tabs = [
  { name: "Overview", href: "/admin/finance" },
  { name: "Transactions", href: "/admin/finance/transactions" },
  { name: "Refunds", href: "/admin/finance/refunds" },
  { name: "Payouts", href: "/admin/finance/payouts" },
  { name: "Event Revenue", href: "/admin/finance/event-revenue" },
  { name: "Event Analytics", href: "/admin/finance/event-analytics" },
  { name: "Subscription Revenue", href: "/admin/finance/subscription-revenue" },
];

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="px-6 py-4 space-y-8">

      {/* 🔥 Modern Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-sm">
            <DollarSign size={22} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finance</h1>
            <p className="text-sm text-gray-500 -mt-1">
              Full financial overview of platform activity
            </p>
          </div>
        </div>
      </div>

      {/* 🔥 Premium Modern Tabs (Pill Style) */}
      <div className="mb-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide bg-gray-400 p-1 rounded-xl">
          {tabs.map((tab) => {
            const active = pathname === tab.href;

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all duration-200
                  ${
                    active
                      ? "bg-white shadow-sm text-primary"
                      : "text-gray-600 hover:text-primary hover:bg-white/60"
                  }
                `}
              >
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Page Content */}
      <div>{children}</div>

      {/* Optional Scrollbar Hide CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
