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
  MdPerson
} from "react-icons/md";

const menuItems = [
  { name: "Dashboard", icon: <MdDashboard />, href: "/organizer/dashboard" },
  { name: "My Events", icon: <MdEvent />, href: "/organizer/events" },
  { name: "Check-In", icon: <MdQrCodeScanner />, href: "/organizer/check-in" },
  { name: "Promo Codes", icon: <MdLocalOffer />, href: "/organizer/promo-codes" },
  { name: "Feedback", icon: <MdFeedback />, href: "/organizer/feedback" },
  { name: "Media Gallery", icon: <MdPhotoLibrary />, href: "/organizer/media" },
  { name: "Payouts", icon: <MdPayments />, href: "/organizer/payouts" },
  { name: "Profile", icon: <MdPerson />, href: "/organizer/profile" },
];

export const OrganizerSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-gradient-to-b from-white to-gray-50/30 border-r border-gray-200/60 h-screen flex flex-col relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.02] to-purple-600/[0.03]"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-200/20 to-transparent rounded-full blur-3xl"></div>
      
      {/* Header */}
      <div className="relative p-8 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <MdEvent className="text-white text-xl" />
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
            EventHub
          </div>
        </div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Organizer Portal
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pb-6">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl font-medium text-sm transition-all duration-300 hover:scale-[1.02] transform-gpu
                  ${isActive 
                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25" 
                    : "text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md hover:shadow-gray-200/50"
                  }
                `}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                )}
                
                {/* Icon */}
                <div className={`
                  flex items-center justify-center w-6 h-6 transition-all duration-300
                  ${isActive 
                    ? "text-white scale-110" 
                    : "text-gray-500 group-hover:text-violet-600 group-hover:scale-110"
                  }
                `}>
                  {item.icon}
                </div>
                
                {/* Label */}
                <span className="font-medium tracking-tight">
                  {item.name}
                </span>
                
                {/* Hover effect background */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                )}
                
                {/* Active glow effect */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl blur-xl opacity-20 -z-10 scale-110"></div>
                )}
              </Link>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-200/60">
          <div className="px-4 py-3 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MdEvent className="text-white text-sm" />
              </div>
              <div>
                <div className="text-xs font-semibold text-gray-800">Pro Plan</div>
                <div className="text-xs text-gray-500">Unlimited events</div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-200/20 to-transparent rounded-full blur-2xl"></div>
    </aside>
  );
};