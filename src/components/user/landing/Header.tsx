"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { userLogout } from "@/redux/slices/user/authSlice";
import { authService } from "@/services/authService";
import {
  FaUserCircle,
  FaSignOutAlt,
  // FaChartBar,
  FaUser,
  // FaKey,
  FaSearch,
  FaTicketAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import GetStartedModal from "./GetStartedModal";

// Import the new logo image.
// Make sure the path is correct. It should be relative to this file or an absolute path from the public directory.
// Based on your previous code, it seems like it should be:
import eventHubLogo from "../../../../public/Gemini_Generated_Image_tnbt85tnbt85tnbt.png"; // Adjust path if necessary

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (searchQuery.trim()) {
  //     router.push(`/events?search=${encodeURIComponent(searchQuery)}`);
  //   }
  // };

  useEffect(() => {
  if (!searchQuery.trim()) return;

  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
    console.log("hello")
  debounceRef.current = setTimeout(() => {
    router.push(`/user/events?search=${encodeURIComponent(searchQuery)}`);
  }, 400); // ⏱️ debounce time

  return () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };
}, [searchQuery]);



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
    <>
    <header className="sticky top-0 z-50 
                  bg-black backdrop-blur-xl 
                  border border-white/60 
                  shadow-[0_2px_20px_rgba(255,255,255,0.08)]">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section - UPDATED */}
          <Link href="/" className="flex items-center flex-shrink-0 gap-3 group">
            {/* The Logo Image */}
            <Image
              src={eventHubLogo}
              alt="EventHub Logo"
              width={48} // Adjust width to match height for a square aspect ratio
              height={48}
              className="object-contain h-12 w-auto group-hover:scale-105 transition-transform duration-300"
              priority
            />
            {/* The Text "EventHub" - Solid White and Bold */}
  <span className="text-3xl font-bold text-white tracking-tighter flex items-center gap-1">
  Event
  <span className="text-red-600 font-light text-4xl -translate-y-0.5">/</span>
  Hub
</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
    <input
      type="text"
      placeholder="Search events, categories, organizers..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="
        w-full pl-12 pr-4 py-3
        bg-gray-100 rounded-2xl
        focus:outline-none focus:ring-2 focus:ring-purple-500/50
        transition-all
      "
    />
  </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {user ? (
              <div className="relative flex border-b-orange-800 items-center space-x-3" ref={dropdownRef}>
                {/* Profile Button */}
                          
                             <button
      onClick={() => setDropdownOpen((prev) => !prev)}
    className="group flex items-center gap-3 pl-2 pr-3 py-1.5 
           rounded-full bg-white/5 hover:bg-white/10 
           transition backdrop-blur-md
           border border-white/60 hover:border-white/70
           hover:shadow-[0_0_12px_rgba(255,255,255,0.25)]"

    >
      {/* Avatar + Border + Status */}
      <div className="relative">
        {user.image ? (
          <Image
            src={user.image}
            alt="User"
            width={36}
            height={36}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full 
                          bg-gradient-to-br from-gray-700 to-gray-900 
                          flex items-center justify-center">
            <FaUserCircle className="text-gray-300 text-lg" />
          </div>
        )}

        {/* Premium Border */}
       <span
  className="absolute inset-0 rounded-full pointer-events-none
             ring-2 ring-yellow-600/100
             group-hover:ring-yellow-500/90 
             transition"
/>

        {/* Online Status */}
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 
                         rounded-full bg-green-500 
                         border-2 border-black" />
      </div>

      {/* Username */}
      <span className="hidden sm:inline text-sm font-semibold text-white">
        {user.name}
      </span>

      {/* Chevron */}
      <svg
        className={`w-4 h-4 text-white/70 transition-transform ${
          isDropdownOpen ? "rotate-180" : ""
        }`}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>


                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 w-72 bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info */}
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
                          <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
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
                      {/* <Link
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
                      </Link> */}

                      <Link
                        href="/user/bookings"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-pink-50 rounded-xl transition-all duration-200 group"
                      >
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                          <FaTicketAlt className="text-pink-600" size={14} />
                        </div>
                        <div>
                          <p className="font-semibold">Bookings</p>
                          <p className="text-xs text-gray-500">View your booked events</p>
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

                      {/* <Link
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
                      </Link> */}
                    </div>

                    {/* Logout */}
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
              <div className="flex items-center gap-2">
  {/* Sign In */}
  <button
    onClick={() => {
      setIsOpen(true);
      setMode("login");
    }}
    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition"
  >
    <FaSignInAlt className="text-base" />
    <span className="hidden sm:inline">Sign In</span>
  </button>

  {/* Get Started */}
  <button
    onClick={() => {
      setIsOpen(true);
      setMode("signup");
    }}
    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-yellow-600 to-red-700 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
  >
    <FaUserPlus className="text-sm" />
    <span>Get Started</span>
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
    </>
  );
};

export default Header;