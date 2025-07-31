"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  onClose: () => void;
  mode:string
}

export default function GetStartedModal({ open, onClose,mode }: Props) {
  const router = useRouter();
  console.log(mode)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-2xl p-6 text-center relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
        <p className="text-gray-500 mb-6">
          Select your account type to continue to your dashboard.
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Event User */}
          <button
            className="border rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition bg-purple-50"
            onClick={() => {
              onClose();
              router.push(`/${mode}/user`);
            }}
          >
            <UserIcon className="w-10 h-10 text-purple-600 mb-2" />
            <h3 className="font-semibold text-purple-600">Event User</h3>
            <p className="text-xs text-gray-500 text-center mt-2">
              Discover amazing events, book tickets & manage bookings.
            </p>
          </button>

          {/* Event Organizer */}
          <button
            className="border rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition bg-orange-50"
            onClick={() => {
              onClose();
              router.push(`/${mode}/organizer`);
            }}
          > 
            <BriefcaseIcon className="w-10 h-10 text-orange-600 mb-2" />
            <h3 className="font-semibold text-orange-600">Event Organizer</h3>
            <p className="text-xs text-gray-500 text-center mt-2">
              Create and manage events, track analytics and grow audience.
            </p>
          </button>
        </div>

        {/* Close */}
        <button
          className="mt-6 text-sm text-red-500 hover:underline"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
