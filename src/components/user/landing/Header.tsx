"use client";

import React, { useState, useEffect, useRef } from "react";
import EventHubIcon from "../../ui/EventHubIcon";
import GetStartedModal from "./GetStartedModal";
import { toast } from "react-toastify";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { FaUserCircle } from "react-icons/fa";
import { clearUser } from "@/redux/slices/user/authSlice";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import Image from 'next/image';


const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  
  //===================================================== Logout handler
 const handleLogout = async () => {
  try {
    const response = await authService.logout();
    toast.success(response.data?.message || "Logged out successfully");
    dispatch(clearUser());
    router.push("/");
  } catch (error) {
    toast.error("Logout failed");
    console.error(error);
  }
};


  //=================================================> Close dropdown on outside click
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <EventHubIcon size={28} className="mr-2" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-violet-600 via-azure-500 to-blue-500 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Centered Nav */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <a
              href="/events"
              className="text-violet-500 hover:text-violet-600 transition-colors text-sm font-medium px-4 py-2"
            >
              Explore Events
            </a>
          </nav>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
<div className="relative flex items-center gap-2" ref={dropdownRef}>
  <button
    onClick={() => setDropdownOpen((prev) => !prev)}
    className="focus:outline-none"
  >
    {user.image ? (
      <Image
        src={user.image}
        alt="User"
        className="w-8 h-8 rounded-full object-cover border border-gray-300"
      />
    ) : (
      <FaUserCircle size={28} className="text-violet-600" />
    )}
  </button>
  <span className="text-sm font-medium text-gray-700">{user.name}</span>

  {/* Dropdown */}
  {isDropdownOpen && (
    <div className="absolute right-0 top-10 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
      <button
        onClick={handleLogout}
        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  )}
</div>

            ) : (
              <>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setMode("login");
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setMode("signup");
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  Get Started
                </button>
              </>
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
