"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  X, 
  BellRing 
} from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface PremiumNotifyProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: NotificationType;
}

const PremiumNotify: React.FC<PremiumNotifyProps> = ({ 
  show, 
  onClose, 
  title, 
  message, 
  type = "success" 
}) => {
  
  // Auto-hide after 5 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const config = {
    success: {
      icon: <CheckCircle2 className="text-emerald-400" size={28} />,
      border: "border-emerald-500/20",
      glow: "bg-emerald-500/10",
      bar: "bg-emerald-500"
    },
    error: {
      icon: <XCircle className="text-rose-400" size={28} />,
      border: "border-rose-500/20",
      glow: "bg-rose-500/10",
      bar: "bg-rose-500"
    },
    warning: {
      icon: <AlertCircle className="text-amber-400" size={28} />,
      border: "border-amber-500/20",
      glow: "bg-amber-500/10",
      bar: "bg-amber-500"
    },
    info: {
      icon: <BellRing className="text-[#f16307]" size={28} />,
      border: "border-[#f16307]/20",
      glow: "bg-[#f16307]/10",
      bar: "bg-[#f16307]"
    }
  };

  const current = config[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
          className="fixed top-6 right-6 z-[10000] w-full max-w-[380px]"
        >
          {/* Outer Glass Container */}
          <div className={`relative overflow-hidden bg-[#111111]/80 backdrop-blur-xl border ${current.border} rounded-3xl shadow-2xl p-5`}>
            
            {/* Internal Glow */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 ${current.glow} blur-3xl rounded-full`} />
            
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className={`absolute inset-0 blur-lg opacity-40 ${current.glow}`} />
                {current.icon}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-black tracking-tight text-lg mb-0.5">
                  {title}
                </h4>
                <p className="text-zinc-400 text-sm font-medium leading-relaxed">
                  {message}
                </p>
              </div>

              <button 
                onClick={onClose}
                className="text-zinc-600 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress Bar (Timer Visual) */}
            <motion.div 
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 5, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 ${current.bar}`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumNotify;