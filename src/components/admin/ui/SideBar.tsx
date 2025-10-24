"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegCalendarCheck } from "react-icons/fa";
import {
  RiDashboardLine,
  RiUserSettingsLine,
  RiShieldCheckLine,
  RiCalendarEventLine,
  RiMoneyDollarCircleLine,
  RiCoupon3Line,
  RiPriceTag3Line,
  RiMailLine,
  RiVipCrownLine,
} from "react-icons/ri";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: RiDashboardLine },
  { name: "User Management", path: "/admin/user-organizer", icon: RiUserSettingsLine },
  { name: "Organizer Verification", path: "/admin/organizer-verification", icon: RiShieldCheckLine },
  { name: "Event Management", path: "/admin/events", icon: RiCalendarEventLine },
  { name: "Finance & Payments", path: "/dashboard/finance", icon: RiMoneyDollarCircleLine },
  { name: "Promo Codes", path: "/dashboard/promo-codes", icon: RiCoupon3Line },
  { name: "Categories & Tags", path: "/admin/categories", icon: RiPriceTag3Line },
  { name: "Communication", path: "/dashboard/communication", icon: RiMailLine },
  { name: "Subscription Plans", path: "/dashboard/subscriptions", icon: RiVipCrownLine },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 z-30 bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-r border-indigo-100 shadow-2xl flex flex-col">
      {/* Logo Section */}
      <div className="px-6 py-8 border-b border-indigo-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
            <FaRegCalendarCheck className="text-2xl text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">EventHub</span>
            <span className="text-xs text-indigo-400 font-semibold">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <div className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 relative
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-sm" />
                )}
                
                {/* Icon */}
                <Icon className={`text-xl flex-shrink-0 transition-transform duration-200 ${isActive ? "" : "group-hover:scale-110 group-hover:text-indigo-600"}`} />
                
                {/* Text */}
                <span className="text-sm font-semibold truncate">{link.name}</span>
                
                {/* Subtle hover glow */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-indigo-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-blue-50/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} EventHub
          </span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
            <span className="text-indigo-600 font-semibold">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}