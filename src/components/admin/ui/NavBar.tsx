"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearAdmin } from "@/redux/slices/admin/authSlice";
import { authService } from "@/services/authService";
import { UserCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Navbar() {
  const admin = useAppSelector(s => s.adminAuth.admin);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const logoutHandler = async () => {
    try {
      await authService.adminLogout();
      dispatch(clearAdmin());
      toast.success("Logged out");
      window.location.href = "/admin-login";
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="
      fixed top-0 left-0 right-0 h-20 
      bg-white/80 backdrop-blur-md 
      border-b border-gray-200 shadow-sm
      z-50 flex items-center justify-between px-8
    ">
      
      {/* Logo moved here */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          EventHub
        </h1>
        <span className="text-xs text-gray-500">Admin Portal</span>
      </div>

      {/* Right side: Profile + Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
          <UserCircle size={32} className="text-indigo-600" />
          <div>
            <p className="font-semibold text-sm">
              {isClient ? admin?.name : "Admin"}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>

        <button
          onClick={logoutHandler}
          className="flex items-center gap-2 px-4 py-2 text-sm 
          bg-gray-50 border border-gray-200 rounded-xl 
          hover:bg-white hover:text-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </header>
  );
}
