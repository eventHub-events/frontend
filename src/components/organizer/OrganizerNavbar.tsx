"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdVerified, MdKeyboardArrowDown } from "react-icons/md";
import { HiSearch, HiSparkles } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { RiVipCrownFill } from "react-icons/ri";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";

import { useRouter } from "next/navigation";
import { clearOrganizer } from "@/redux/slices/organizer/authSlice";
import { GiConsoleController } from "react-icons/gi";

export const OrganizerNavbar: React.FC = () => {
    const organizer = useAppSelector((state) => state.organizerAuth.organizer);
    const router= useRouter()
    const dispatch= useAppDispatch()
    if (!organizer) return null
  // const organizer = {
  //   id: "org_123456789",
  //   name: "John Doe",
  //   email: "johndoe@eventhub.com",
  //   phone: 9876543210,
  //   companyName: "Doe Events Pvt Ltd",
  //   kycStatus: "verified",
  //   totalEarnings: 125000,
  //   trustScore: 4.8,
  //   profileDescription: "We organize premium corporate and wedding events across the country.",
  //   image: "https://example.com/uploads/organizer-avatar.jpg",
  //   isBlock: false,
  //   role: "organizer",
  //   isVerified: true
  // };

  const handleLogout = async () => {
  try {
    const response = await authService.logout();
    toast.success(response.data?.message || "Logged out successfully");
  } catch (error) {
    toast.error("Logout failed on server, logging out locally");
    console.error(error);
  } finally {
    dispatch(clearOrganizer());
    router.push("/");
  }
};


  return (
    <header className="relative h-24 bg-white/70 backdrop-blur-2xl border-b border-gray-200/40 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm shadow-gray-900/5">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/[0.02] via-purple-500/[0.01] to-pink-500/[0.02] animate-gradient-x"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-2 left-20 w-3 h-3 bg-violet-400/20 rounded-full blur-sm animate-pulse"></div>
      <div className="absolute top-4 right-32 w-2 h-2 bg-purple-400/30 rounded-full blur-sm animate-bounce"></div>
      
      {/* Search Section */}
      <div className="flex-1 max-w-2xl relative z-10">
        <div className="relative group">
          {/* Search Container with Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/5 to-pink-500/10 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-500"></div>
          
          <div className="relative bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-3xl shadow-lg shadow-gray-900/5 group-focus-within:shadow-xl group-focus-within:shadow-violet-500/10 transition-all duration-300">
            <HiSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-all duration-300 group-focus-within:scale-110" size={22} />
            
            <input
              type="text"
              placeholder="Search events, venues, or services..."
              className="w-full bg-transparent pl-14 pr-6 py-4 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none rounded-3xl"
            />
            
            {/* AI Assistant Indicator */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 text-xs text-gray-400 group-focus-within:text-violet-600 transition-colors duration-300">
              <HiSparkles className="animate-pulse" />
              {/* <span className="hidden md:inline font-medium">AI Search</span> */}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-8 relative z-10">
        {/* Notifications with Modern Badge */}
        <div className="relative">
          <button className="relative p-4 text-gray-500 hover:text-violet-600 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200/40 hover:border-violet-200/60 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <FaBell size={20} className="group-hover:scale-110 transition-transform duration-300" />
            
            {/* Enhanced Notification Badge */}
            <div className="absolute -top-2 -right-2 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
                <span className="text-xs font-bold text-white">3</span>
              </div>
              <div className="absolute w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-ping opacity-20"></div>
              <div className="absolute w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-full animate-ping opacity-10"></div>
            </div>
          </button>
        </div>

        {/* Enhanced Profile Section */}
        <div className="relative group">
          {/* Profile Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          
          <div className="relative flex items-center gap-4 p-3 pr-5 bg-white/80 hover:bg-white/95 backdrop-blur-xl border border-gray-200/50 hover:border-violet-200/60 rounded-3xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-gray-900/10">
            {/* Avatar with Status Ring */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl animate-pulse opacity-20"></div>
              
              {organizer?.image ? (
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="relative w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="relative w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <FaUserCircle size={28} className="text-white" />
                </div>
              )}
              
              {/* Status Indicators  */}
              {/* { {organizer.kycStatus === "Verified" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                  <MdVerified size={14} className="text-emerald-500" />
                </div>
              )} */}
              
              {/* Online Status */}
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </div>
            
            {/* User Info */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors truncate">
                  {organizer.name}
                </span>
                {organizer.isVerified && (
                  <div className="flex items-center gap-1">
                    <MdVerified size={16} className="text-blue-500 flex-shrink-0" />
                    <RiVipCrownFill size={14} className="text-amber-500 flex-shrink-0" />
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-gray-500 truncate max-w-32">
                  {organizer.companyName?organizer.companyName:""}
                </span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-xs font-medium text-emerald-600">
                  ${(organizer.totalEarnings / 1000)?(organizer.totalEarnings / 1000):0}k
                </span>
              </div>
            </div>
            
            {/* Dropdown Arrow */}
            <MdKeyboardArrowDown 
              size={20} 
              className="text-gray-400 group-hover:text-violet-600 group-hover:rotate-180 transition-all duration-300" 
            />
          </div>
        </div>

        {/* Enhanced Logout Button */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
          
          <button
            onClick={ handleLogout}
            className="relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-red-50/80 to-rose-50/80 hover:from-red-100 hover:to-rose-100 backdrop-blur-md text-red-600 hover:text-red-700 rounded-2xl font-semibold text-sm border border-red-200/50 hover:border-red-300/70 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-red-500/10 transform hover:scale-105"
          >
            <BiLogOut size={18} className="group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <span className="hidden sm:inline">Logout</span>
            
            {/* Button Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:animate-pulse group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent"></div>
    </header>
  );
};