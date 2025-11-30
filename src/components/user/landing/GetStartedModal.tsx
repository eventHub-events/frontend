"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { UserIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

export default function GetStartedModal({ open, onClose, mode }: Props) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-2xl p-6 text-center relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome Back!
        </h2>

        <p className="text-gray-500 mb-6">
          Select your account type to continue
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* User */}
          <button
            className="border rounded-xl p-6 bg-purple-50 hover:shadow-lg transition"
            onClick={() => {
              onClose();
              router.push(`/${mode}/user`);
            }}
          >
            <UserIcon className="w-10 h-10 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-purple-600">Event User</h3>
            <p className="text-xs text-gray-500 mt-2">
              Discover events & book tickets
            </p>
          </button>

          {/* Organizer */}
          <button
            className="border rounded-xl p-6 bg-orange-50 hover:shadow-lg transition"
            onClick={() => {
              onClose();
              router.push(`/${mode}/organizer`);
            }}
          >
            <BriefcaseIcon className="w-10 h-10 text-orange-600 mx-auto mb-2" />
            <h3 className="font-semibold text-orange-600">
              Event Organizer
            </h3>
            <p className="text-xs text-gray-500 mt-2">
              Create and manage events
            </p>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-red-500 hover:underline"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
}
