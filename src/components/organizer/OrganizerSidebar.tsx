"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdEvent,
  // MdQrCodeScanner,
  // MdLocalOffer,
  // MdFeedback,
  // MdPayments,
  MdPerson,
  MdChevronLeft,
  MdChevronRight,
  // MdRocket,
  // MdTrendingUp,
  MdSubscriptions,
  MdMessage,
  MdInsights
} from "react-icons/md";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

const menuItems = [
  { name: "Dashboard", icon: <MdDashboard />, href: "/organizer/dashboard" },
  { name: "My Events", icon: <MdEvent />, href: "/organizer/events" },
  // { name: "Bookings", icon: <MdPayments />, href: "/organizer/bookings" },
  // { name: "Check-In", icon: <MdQrCodeScanner />, href: "/organizer/check-in" },
  // { name: "Promo Codes", icon: <MdLocalOffer />, href: "/organizer/promo-codes" },
  // { name: "Feedback", icon: <MdFeedback />, href: "/organizer/feedback" },
   { name: "Event Analytics", icon: <MdInsights />, href: "/organizer/event-analytics" },

  // { name: "Payouts", icon: <MdPayments />, href: "/organizer/payouts" },
  { name: "Subscription Plans", icon: <MdSubscriptions />, href: "/organizer/subscription-plans" },
  { name: "Profile", icon: <MdPerson />, href: "/organizer/profile" },
  { name: "Reviews", icon: <MdPerson />, href: "/organizer/reviews" },
  { name: "Messages", icon: <MdMessage />, href: "/organizer/messages" },
];

export const OrganizerSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);

  return (
    <>
      <aside className={`
        fixed top-0 left-0 h-screen flex flex-col z-50
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-80'}
        bg-white border-r border-slate-200
      `}>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/30"></div>
        
        {/* Header Section */}
        <div className="relative h-20 px-6 flex items-center border-b border-slate-200">
          <div className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed ? 'justify-center w-full' : ''}`}>
            {/* Logo */}
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <MdEvent className="text-white text-2xl" />
            </div>

            {/* Brand Text */}
            {!isCollapsed && (
              <div className="flex flex-col">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  EventHub
                </div>
                <div className="text-xs font-semibold text-indigo-600 tracking-wider uppercase">
                  Organizer
                </div>
              </div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              absolute -right-4 top-1/2 -translate-y-1/2
              w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full
              shadow-lg shadow-indigo-500/30 flex items-center justify-center
              text-white hover:scale-110 hover:shadow-indigo-500/50
              transition-all duration-300
            `}
          >
            {isCollapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center gap-4
                    transition-all duration-300
                    ${isCollapsed ? 'justify-center px-3' : 'px-5'}
                    py-4 rounded-2xl font-semibold text-base
                    ${isActive 
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]" 
                      : "text-black hover:text-indigo-600 hover:bg-indigo-50/80 hover:scale-[1.01]"
                    }
                  `}
                >
                  {/* Icon Container */}
                  <div className={`
                    relative z-10 flex items-center justify-center
                    transition-all duration-300
                    ${!isActive && 'group-hover:scale-110'}
                  `}>
                    <span className="text-2xl">
                      {item.icon}
                    </span>
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span className="relative z-10 tracking-wide">
                      {item.name}
                    </span>
                  )}

                  {/* Active indicator dot for collapsed */}
                  {isActive && isCollapsed && (
                    <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50"></div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-4 px-4 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap z-50">
                      {item.name}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Stats Card */}
          {/* {!isCollapsed && (
            <div className="mt-8 mx-1">
              <div className="relative p-5 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 overflow-hidden group hover:shadow-lg transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <MdTrendingUp className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-slate-800">12</div>
                    <div className="text-xs text-slate-600 font-medium">Total Events</div>
                  </div>
                </div>
                
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">This Month</span>
                    <span className="text-emerald-600 font-bold">+3 Events</span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2.5 rounded-full w-3/4 shadow-md shadow-emerald-500/20"></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Goal Progress</span>
                    <span className="text-slate-800 font-bold">75%</span>
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* Upgrade Card */}
          {/* {!isCollapsed && (
            <div className="mt-4 mx-1">
              <div className="relative p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-2xl overflow-hidden group/upgrade cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                <div className="absolute inset-0 bg-black/5"></div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
                
                <div className="relative z-10 flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/40">
                    <MdRocket className="text-white text-xl" />
                  </div>
                  <div>
                    <div className="text-base font-bold text-white">Go Premium</div>
                    <div className="text-xs text-white/90 font-medium">Unlock Everything</div>
                  </div>
                </div>
                
                <button className="relative z-10 w-full px-4 py-3 bg-white text-orange-600 text-sm font-bold rounded-xl hover:bg-amber-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
                  Upgrade Now →
                </button>
              </div>
            </div>
          )} */}
        </nav>

        {/* User Profile Section */}
        <div className="relative p-5 border-t border-slate-200 bg-slate-50/50 backdrop-blur-sm">
          <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : ''}`}>
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <MdPerson className="text-white text-xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-3 border-white rounded-full shadow-md"></div>
            </div>
            
            {/* User Info */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800 truncate">
                  {organizer?.name || "John Doe"}
                </div>
                {/* <div className="text-xs text-slate-600 truncate font-medium">Premium Organizer</div> */}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for main content */}
      <div className={`${isCollapsed ? 'w-20' : 'w-80'} flex-shrink-0 transition-all duration-300`} />
    </>
  );
};