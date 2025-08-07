"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaRegCalendarCheck } from "react-icons/fa"; // Example icon, install react-icons if needed

const links = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "User Management", path: "/dashboard/user-management" },
  { name: "Organizer Management", path: "/dashboard/organizer-management" },
  { name: "Event Management", path: "/dashboard/event-management" },
  { name: "Finance & Payments", path: "/dashboard/finance" },
  { name: "Promo Codes", path: "/dashboard/promo-codes" },
  { name: "Categories & Tags", path: "/dashboard/categories" },
  { name: "Communication", path: "/dashboard/communication" },
  { name: "Subscription Plans", path: "/dashboard/subscriptions" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen fixed left-0 top-0 z-30 bg-white/70 backdrop-blur-lg border-r border-gray-200 shadow-xl rounded-r-3xl p-6 flex flex-col items-center">
      <div className="flex items-center gap-3 mb-8">
        <FaRegCalendarCheck className="text-3xl text-blue-600 drop-shadow" />
        <span className="text-2xl font-extrabold tracking-tight text-gray-900">EventPro</span>
      </div>
      <nav className="flex flex-col gap-2 w-full">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200
              ${
                pathname === link.path
                  ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg scale-105"
                  : "text-gray-700 hover:bg-gray-100 hover:scale-105"
              }
            `}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-gray-400 pt-8">
        &copy; {new Date().getFullYear()} EventPro
      </div>
    </aside>
  );
}