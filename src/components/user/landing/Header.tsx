"use client";

import React, { useState, useEffect, useRef } from "react";
import EventHubIcon from "../../ui/EventHubIcon";
import GetStartedModal from "./GetStartedModal";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaChartBar,
  FaUser,
  FaKey,
  FaSearch,
} from "react-icons/fa";
import { userLogout } from "@/redux/slices/user/authSlice";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Image from "next/image";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      toast.success(response.data?.message || "Logged out successfully");
      dispatch(userLogout());
      router.push("/");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [user]);

  return (
    <header className="sticky top-0 z-50 bg-black backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Enhanced Logo with Attractive Font and Colors */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-white via-red-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <div className="text-white font-black text-xl tracking-tighter drop-shadow-lg">EH</div>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-40 transition-all duration-1000 group-hover:duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-pink-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-all duration-700"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black bg-gradient-to-r from-red-900 via-yellow-600 to-pink-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
                EventHub
              </span>
              <span className="text-[10px] font-semibold bg-gradient-to-r from-yellow-600 to-red-400 bg-clip-text text-transparent tracking-widest uppercase mt-0.5">
                Experience • Connect • Celebrate
              </span>
            </div>
          </Link>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search events, concerts, conferences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white transition-all duration-200 text-sm"
                />
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div
                className="relative flex items-center space-x-3"
                ref={dropdownRef}
              >
                {/* User Profile */}
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-3 p-1 rounded-2xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">Member</span>
                  </div>
                  
                  <div className="relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="User"
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/20 shadow-sm"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                        <FaUserCircle size={20} className="text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </button>

                {/* Enhanced Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 w-72 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* User Header */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200/60">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt="User"
                            className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-sm"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                            <FaUserCircle size={24} className="text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">Online</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-3 bg-gray-50/50 border-b border-gray-200/60">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-xs font-semibold text-gray-900">5</p>
                          <p className="text-[10px] text-gray-500">Bookings</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">2</p>
                          <p className="text-[10px] text-gray-500">Upcoming</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">3</p>
                          <p className="text-[10px] text-gray-500">Attended</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        href="/user/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                          <FaChartBar className="text-purple-600" size={14} />
                        </div>
                        <div>
                          <p className="font-semibold">Dashboard</p>
                          <p className="text-xs text-gray-500">Your bookings & events</p>
                        </div>
                      </Link>
                      
                      <Link
                        href="/user/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <FaUser className="text-blue-600" size={14} />
                        </div>
                        <div>
                          <p className="font-semibold">Profile</p>
                          <p className="text-xs text-gray-500">Edit your profile</p>
                        </div>
                      </Link>
                      
                      <Link
                        href="/change-password"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                          <FaKey className="text-green-600" size={14} />
                        </div>
                        <div>
                          <p className="font-semibold">Change Password</p>
                          <p className="text-xs text-gray-500">Update your password</p>
                        </div>
                      </Link>
                    </div>

                    {/* Logout Section */}
                    <div className="border-t border-gray-200/60 p-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <FaSignOutAlt size={14} className="text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold">Logout</p>
                          <p className="text-xs text-red-500">Sign out from EventHub</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setMode("login");
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-purple-600 transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setMode("signup");
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-yellow-600 to-red-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <GetStartedModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
      />
    </header>
  );
};

export default Header;