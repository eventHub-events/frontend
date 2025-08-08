"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAdmin } from "@/redux/slices/admin/authSlice";
import { authService } from "@/services/authService";
import { Bell, UserCircle, Search, Sparkles, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";

export default function Navbar() {
  const admin = useAppSelector((state) => state.adminAuth.admin);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authService.adminLogout();
      dispatch(clearAdmin());
      toast.success("Admin logout successful"); 
      router.push("/admin/login");
    } catch (error: unknown) {
      const err= error instanceof Error?error.message:"Logout failed. Please try again."
      toast.error(err);
    }
  };
  return (
    <header className="h-20 fixed top-0 left-64 right-0 bg-white/85 backdrop-blur-xl border-b border-gray-200/60 px-8 flex items-center justify-between z-50 shadow-sm shadow-gray-900/5">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.02] via-blue-500/[0.01] to-purple-500/[0.02]"></div>

      {/* Floating Orbs */}
      <div className="absolute top-3 left-20 w-2 h-2 bg-violet-400/20 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-6 right-32 w-1.5 h-1.5 bg-blue-400/30 rounded-full blur-sm animate-bounce"></div>

      {/* Search Input */}
      <div className="relative w-1/3 group">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500"></div>

        <div className="relative bg-gray-50/80 backdrop-blur-md border border-gray-200/60 rounded-2xl shadow-sm group-focus-within:shadow-lg group-focus-within:shadow-violet-500/10 transition-all duration-300">
          <Search
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-all duration-300 group-focus-within:scale-110"
            size={18}
          />

          <input
            type="text"
            placeholder="Search users, events..."
            className="w-full bg-transparent pl-12 pr-6 py-3.5 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
          />

          {/* AI Search Indicator */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-xs text-gray-400 group-focus-within:text-violet-600 transition-colors duration-300">
            <Sparkles size={14} className="animate-pulse" />
            <span className="hidden lg:inline font-medium">Smart Search</span>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Bell */}
        <div className="relative">
          <button className="relative p-3 text-gray-500 hover:text-violet-600 bg-gray-50/60 hover:bg-white backdrop-blur-md rounded-xl border border-gray-200/40 hover:border-violet-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
            <Bell
              size={20}
              className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-xs font-bold text-white">3</span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-ping opacity-20"></div>
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 p-3 bg-gray-50/60 hover:bg-white backdrop-blur-md border border-gray-200/40 hover:border-violet-200/60 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg group">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-blue-500/5 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full animate-pulse opacity-20"></div>

            <div className="relative w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
              <UserCircle size={24} className="text-white" />
            </div>

            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>

          <div className="flex flex-col min-w-0">
            <p className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">
              {admin ? admin.name : "Admin User"}
            </p>
            <p className="text-xs font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-200">
              System Administrator
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="p-3 text-gray-500 hover:text-red-600 bg-gray-50/60 hover:bg-white backdrop-blur-md rounded-xl border border-gray-200/40 hover:border-red-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex items-center gap-2"
          onClick={() => {
            console.log("Logging out...");
            handleLogout();
          }}
        >
          <LogOut size={18} />
          <span className="text-sm font-semibold hidden md:inline">Logout</span>
        </button>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
    </header>
  );
}
