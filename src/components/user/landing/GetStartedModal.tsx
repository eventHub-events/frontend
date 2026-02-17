"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { UserIcon, BriefcaseIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { TicketIcon, SparklesIcon } from "@heroicons/react/24/solid";

interface Props {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

export default function GetStartedModal({ open, onClose, mode }: Props) {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Brand Colors matching your Home Page
  const brandGradient = "from-[#f16307] to-[#e43a15]";
  const accentColor = "text-[#f16307]";

  useEffect(() => {
    setMounted(true);
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      setMounted(false);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Animated Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="bg-[#0f0f0f] border border-zinc-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 transform transition-all">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-8 pt-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center justify-center p-3 bg-[#f16307]/10 rounded-2xl mb-4`}>
              <TicketIcon className={`w-8 h-8 ${accentColor}`} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
              {mode === "login" ? "Welcome Back" : "Join Event Hub"}
            </h2>
            <p className="text-zinc-500 font-medium">
              Choose your path to get started
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* User Option */}
            <button
              className="group relative flex items-center gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-[1.5rem] hover:border-[#f16307]/50 hover:bg-zinc-900 transition-all text-left"
              onClick={() => {
                onClose();
                router.push(`/${mode}/user`);
              }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#f16307] transition-colors">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-[#f16307] transition-colors">Event User</h3>
                <p className="text-sm text-zinc-500">Explore and book tickets for amazing events.</p>
              </div>
              <SparklesIcon className="w-5 h-5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Organizer Option */}
            <button
              className="group relative flex items-center gap-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-[1.5rem] hover:border-[#f16307]/50 hover:bg-zinc-900 transition-all text-left"
              onClick={() => {
                onClose();
                router.push(`/${mode}/organizer`);
              }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center group-hover:bg-[#f16307] transition-colors">
                <BriefcaseIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white text-lg group-hover:text-[#f16307] transition-colors">Event Organizer</h3>
                <p className="text-sm text-zinc-500">Host, manage, and grow your event community.</p>
              </div>
              <SparklesIcon className="w-5 h-5 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          {/* Action Button - Sign In to Hub */}
          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
             <button
              onClick={onClose}
              className={`w-full py-4 rounded-2xl text-white font-black bg-gradient-to-r ${brandGradient} shadow-lg shadow-[#f16307]/20 hover:brightness-110 active:scale-[0.98] transition-all`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}