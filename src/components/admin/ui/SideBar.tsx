"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiUserSettingsLine,
  RiShieldCheckLine,
  RiCalendarEventLine,
  RiBook2Line,
  RiMoneyDollarCircleLine,
  // RiCoupon3Line,
  RiPriceTag3Line,
  // RiMailLine,
  RiVipCrownLine,
  RiFlagLine,
} from "react-icons/ri";

const links = [
  { name: "Dashboard", path: "/admin/dashboard", icon: RiDashboardLine },
  { name: "User Management", path: "/admin/user-organizer", icon: RiUserSettingsLine },
  { name: "Organizer Verification", path: "/admin/organizer-verification", icon: RiShieldCheckLine },
  { name: "Event Management", path: "/admin/events", icon: RiCalendarEventLine },
  { name: "Bookings", path: "/admin/bookings", icon: RiBook2Line },
  { name: "Finance & Payments", path: "/admin/finance", icon: RiMoneyDollarCircleLine },
  // { name: "Promo Codes", path: "/admin/promo-codes", icon: RiCoupon3Line },
  { name: "Categories & Tags", path: "/admin/categories", icon: RiPriceTag3Line },
  // { name: "Communication", path: "/admin/communication", icon: RiMailLine },
  { name: "Subscription Plans", path: "/admin/subscription-plans", icon: RiVipCrownLine },
  { name: "Reports", path: "/admin/reports", icon: RiFlagLine },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className="
        fixed top-20 left-0  /* sidebar starts below navbar */
        w-72 h-[calc(100vh-5rem)]
        bg-gradient-to-b from-white to-gray-50
        border-r border-gray-200 shadow-md
        z-40 flex flex-col
      "
    >

      {/* Navigation menu */}
      <nav className="flex-1 px-5 py-6 space-y-2 overflow-y-auto">
        {links.map(({ name, path, icon: Icon }) => {
          const active = pathname === path;

          return (
            <Link
              key={path}
              href={path}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium
                transition-all relative group

                ${active
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-black font-extrabold hover:bg-indigo-50 hover:text-indigo-700"}
              `}
            >
              {active && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-xl"></div>
              )}

              <Icon className="text-2xl" />
              <span className="whitespace-nowrap">{name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-gray-200 text-xs text-gray-500">
        © {new Date().getFullYear()} EventHub
      </div>
    </aside>
  );
}
