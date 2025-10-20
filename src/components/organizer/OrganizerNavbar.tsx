"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { MdVerified, MdKeyboardArrowDown } from "react-icons/md";
import { HiSearch, HiSparkles } from "react-icons/hi";
import { BiLogOut } from "react-icons/bi";
import { toast } from "react-toastify";
import { authService } from "@/services/authService";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { organizerLogout } from "@/redux/slices/organizer/authSlice";

export const OrganizerNavbar: React.FC = () => {
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const router = useRouter();
  const dispatch = useAppDispatch();

  if (!organizer) return null;

  const handleLogout = async () => {
    try {
      const response = await authService.logout();
      toast.success(response.data?.message || "Logged out successfully");
    } catch (error) {
      toast.error("Logout failed on server, logging out locally");
      console.error(error);
    } finally {
      dispatch(organizerLogout());
      router.push("/");
    }
  };

  return (
    <header className="relative h-20 bg-white/70 backdrop-blur-xl border-b border-gray-200/40 flex items-center justify-between px-6 sticky top-0 z-50 shadow-sm shadow-gray-900/5">
      {/* Left: Logo Placeholder */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-extrabold text-violet-700">EventHub</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-auto relative z-10">
        <div className="relative group">
          <div className="relative bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-sm shadow-gray-900/5 focus-within:shadow-violet-500/10 transition-all duration-300">
            <HiSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-violet-600 transition-all duration-300"
              size={20}
            />
            <input
              type="text"
              placeholder="Search events, venues, or services..."
              className="w-full bg-transparent pl-12 pr-10 py-2.5 text-sm font-medium text-gray-700 placeholder-gray-400 focus:outline-none rounded-2xl"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400 group-focus-within:text-violet-600">
              <HiSparkles className="animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3 ml-6">
        {/* Notifications */}
        <div className="relative">
          <button className="relative p-3 text-gray-500 hover:text-violet-600 bg-white/60 hover:bg-white/90 backdrop-blur-md rounded-xl border border-gray-200/40 hover:border-violet-200/60 transition-all duration-300">
            <FaBell size={18} />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              3
            </span>
          </button>
        </div>

        {/* Profile */}
        <div className="relative group">
          <div className="relative flex items-center gap-3 px-3 py-2 bg-white/80 hover:bg-white/95 backdrop-blur-xl border border-gray-200/50 hover:border-violet-200/60 rounded-2xl transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
            <div className="relative">
              {organizer?.image ? (
                <Image
                  src={organizer.image}
                  alt={organizer.name}
                  width={40}
                  height={40}
                  className="rounded-xl object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <FaUserCircle size={24} className="text-white" />
                </div>
              )}
              <div className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {organizer.name}
                </span>
                {organizer.isVerified && (
                  <MdVerified size={16} className="text-blue-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs font-medium text-gray-500 truncate max-w-[100px]">
                {organizer.companyName ?? ""}
              </span>
            </div>

            <MdKeyboardArrowDown
              size={20}
              className="text-gray-400 group-hover:text-violet-600 transition-transform duration-300 group-hover:rotate-180"
            />
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-600 hover:text-red-700 rounded-2xl border border-red-200 hover:border-red-300 transition-all duration-300 shadow-sm hover:shadow-md font-semibold text-sm"
        >
          <BiLogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
