"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { FaUserCircle } from "react-icons/fa";
import { MdVerified, MdKeyboardArrowDown } from "react-icons/md";
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
    <header className="fixed top-0 left-0 right-0 h-20  bg-white/80 backdrop-blur-lg border-b border-slate-100/80 flex items-center justify-between px-8 z-40 transition-all duration-300 shadow-sm supports-[backdrop-filter]:bg-white/60">
      
      {/* Left: Logo for mobile */}
      <div className="lg:hidden flex items-center">
        <div className="w-10 h-10 bg-gradient-to-tr from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-500/20">
          <span className="text-white font-black text-lg">E</span>
        </div>
      </div>

      {/* Center: Search Placeholder (Hidden as per original) */}
      <div className="hidden md:flex flex-1 max-w-2xl">
        <div className="relative w-full">
          {/* Search functionality here later */}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Profile Dropdown */}
        <div className="relative group cursor-pointer">
          {/* Modernized container: lighter background, ring instead of heavy border */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50/80 hover:bg-slate-100 rounded-2xl ring-1 ring-slate-200/50 hover:ring-slate-300 transition-all duration-300">
            <div className="relative flex-shrink-0">
              {organizer?.image ? (
                <Image
                  src={organizer.image}
                  alt={organizer.name}
                  width={40}
                  height={40}
                  className="rounded-xl object-cover shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                  <FaUserCircle size={22} className="text-white/90" />
                </div>
              )}
              {/* Verified Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[2px] border-white ring-1 ring-emerald-100"></div>
            </div>

            <div className="hidden lg:flex flex-col items-start min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-slate-800 truncate max-w-[140px]">
                  {organizer.name}
                </span>
                {organizer.isVerified && (
                  <MdVerified size={16} className="text-indigo-500 flex-shrink-0" />
                )}
              </div>
              <span className="text-xs text-slate-500 font-medium truncate max-w-[140px]">
                {organizer.companyName ?? "Organizer"}
              </span>
            </div>

            <MdKeyboardArrowDown
              size={20}
              className="hidden lg:block text-slate-400 group-hover:text-indigo-600 transition-all duration-300 group-hover:rotate-180"
            />
          </div>
        </div>

        {/* Logout Button - Refined Gradient */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-5 py-3 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl transition-all shadow-md hover:shadow-lg shadow-rose-500/20 font-bold text-sm group active:scale-95"
        >
          <BiLogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};