"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdDashboard,
  MdEvent,
  MdQrCodeScanner,
  MdLocalOffer,
  MdFeedback,
  MdPhotoLibrary,
  MdPayments,
  MdPerson,
  MdChevronLeft,
  MdChevronRight,
  MdRocket,
  MdTrendingUp,
  MdSubscriptions,
  MdMessage
} from "react-icons/md";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

const menuItems = [
  { name: "Dashboard", icon: <MdDashboard />, href: "/organizer/dashboard" },
  { name: "My Events", icon: <MdEvent />, href: "/organizer/events" },
  { name: "Bookings", icon: <MdPayments />, href: "/organizer/bookings" },
  { name: "Check-In", icon: <MdQrCodeScanner />, href: "/organizer/check-in" },
  { name: "Promo Codes", icon: <MdLocalOffer />, href: "/organizer/promo-codes" },
  { name: "Feedback", icon: <MdFeedback />, href: "/organizer/feedback" },
  { name: "Media Gallery", icon: <MdPhotoLibrary />, href: "/organizer/media" },
  { name: "Payouts", icon: <MdPayments />, href: "/organizer/payouts" },
  { name: "Subscription Plans", icon: <MdSubscriptions />, href: "/organizer/subscription-plans" },
  { name: "Profile", icon: <MdPerson />, href: "/organizer/profile" },
  { name: "Messages", icon: <MdMessage />, href: "/organizer/messages" },
];

export const OrganizerSidebar: React.FC = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  return (
    <>
      <aside className={`
        fixed top-0 left-0 h-screen flex flex-col z-50
        transition-all duration-400 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-72'}
        bg-white
        border-r border-gray-100
        shadow-lg shadow-gray-200/50
        group/sidebar
      `}>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-blue-50/20 pointer-events-none"></div>
        
        {/* Accent Line */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-emerald-400"></div>

        {/* Header Section */}
        <div className="relative p-6 pb-4 border-b border-gray-100/80">
          <div className={`flex items-center gap-3 transition-all duration-400 ${isCollapsed ? 'justify-center' : ''}`}>
            {/* Logo */}
            <div className={`
              relative flex items-center justify-center
              transition-all duration-400
              ${isCollapsed ? 'w-10 h-10' : 'w-12 h-12'}
              bg-white
              border border-gray-200
              rounded-xl
              shadow-sm
              group/logo hover:shadow-md hover:border-blue-300
            `}>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center">
                <MdEvent className="text-white text-lg" />
              </div>
            </div>

            {/* Brand Text */}
            <div className={`transition-all duration-400 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
              <div className="text-2xl font-bold text-gray-900">
                EventHub
              </div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mt-0.5">
                Organizer
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              absolute -right-3 top-1/2 -translate-y-1/2
              w-6 h-6 bg-white border border-gray-300 rounded-full
              shadow-md
              flex items-center justify-center
              text-gray-500 hover:text-blue-600
              transition-all duration-400 hover:scale-110
              hover:border-blue-400 hover:shadow-blue-200
              ${isCollapsed ? 'rotate-180' : ''}
            `}
          >
            {isCollapsed ? <MdChevronRight size={14} /> : <MdChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group relative flex items-center
                    transition-all duration-300 ease-out
                    ${isCollapsed ? 'justify-center px-2' : 'px-4'}
                    py-3 rounded-xl font-medium
                    hover:translate-x-1 transform-gpu
                    ${isActive 
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-500 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/80"
                    }
                  `}
                >
                  {/* Icon */}
               <div className="relative flex items-center justify-center">
  <span
    className={`
      ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}
      flex items-center justify-center
      transition-all duration-300
      ${isActive 
        ? 'text-blue-600'
        : 'text-gray-400 group-hover:text-blue-500'
      }
    `}
  >
    {item.icon}
  </span>

  
</div>



                  {/* Label */}
                  <span className={`
                    text-sm font-medium transition-all duration-300
                    ${isCollapsed 
                      ? 'w-0 opacity-0 ml-0' 
                      : 'w-auto opacity-100 ml-3'
                    }
                    ${isActive ? 'font-semibold' : ''}
                  `}>
                    {item.name}
                  </span>

                  {/* Active Dot for collapsed state */}
                  {isActive && isCollapsed && (
                    <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Stats Card */}
          <div className={`
            mt-6 transition-all duration-400
            ${isCollapsed ? 'px-2' : 'px-3'}
          `}>
            <div className={`
              p-4 bg-gradient-to-br from-blue-50 to-emerald-50
              rounded-xl border border-blue-100
              transition-all duration-400
              ${isCollapsed ? 'text-center' : ''}
              group/card hover:shadow-md hover:border-blue-200
            `}>
              <div className={`flex items-center transition-all duration-400 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <MdTrendingUp className="text-white text-sm" />
                </div>
                
                <div className={`
                  transition-all duration-400 overflow-hidden
                  ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                `}>
                  <div className="text-sm font-semibold text-gray-900">12 Events</div>
                  <div className="text-xs text-emerald-600 mt-0.5">+3 this month</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              {!isCollapsed && (
                <div className="mt-3 space-y-2">
                  <div className="w-full bg-blue-100 rounded-full h-1.5">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-1.5 rounded-full w-3/4 shadow-sm"></div>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Monthly Progress</span>
                    <span className="text-emerald-600 font-medium">75%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade Card */}
          <div className={`
            mt-3 transition-all duration-400
            ${isCollapsed ? 'px-2' : 'px-3'}
          `}>
            <div className={`
              p-4 bg-gradient-to-br from-orange-50 to-amber-50
              rounded-xl border border-amber-200
              transition-all duration-400
              ${isCollapsed ? 'text-center' : ''}
              group/upgrade hover:shadow-md hover:border-amber-300
            `}>
              <div className={`flex items-center transition-all duration-400 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0 group-hover/upgrade:scale-110 transition-transform duration-300">
                  <MdRocket className="text-white text-sm" />
                </div>
                
                <div className={`
                  transition-all duration-400 overflow-hidden
                  ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
                `}>
                  <div className="text-sm font-semibold text-gray-900">Go Premium</div>
                  <div className="text-xs text-amber-600 mt-0.5">Unlock features</div>
                </div>
              </div>
              
              {/* Upgrade Button */}
              {!isCollapsed && (
                <button className="w-full mt-3 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.02] transform-gpu">
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className={`
          p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm
          transition-all duration-400
          ${isCollapsed ? 'px-3' : 'px-4'}
        `}>
          <div className={`flex items-center transition-all duration-400 ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <MdPerson className="text-white text-lg" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></div>
            </div>
            
            {/* User Info */}
            <div className={`
              transition-all duration-400 overflow-hidden
              ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}
            `}>
              <div className="text-sm font-semibold text-gray-900">John Doe</div>
              <div className="text-xs text-gray-500">Organizer</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <div 
        className="lg:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
        style={{ display: 'none' }}
      />
    </>
  );
};