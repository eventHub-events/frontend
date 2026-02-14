"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Mail, ShieldCheck, ArrowLeft, RotateCw, Timer } from "lucide-react";

// Services
import { authService } from "../../services/authService";
import { passwordService } from "@/services/user/passwordService";

interface OTPPageProps {
  userType: "user" | "organizer";
}

export default function OTPPage({ userType }: OTPPageProps) {
  const isUser = userType === "user";
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"register" | "reset">("register");

  // Brand Palette
  const brandGradient = "from-[#f16307] via-[#e43a15] to-[#f16307]";
  const accentColor = "text-[#f16307]";

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const t = (searchParams.get("type") || "register") as "register" | "reset";
    setType(t);

    if (t === "reset") {
      const storedEmail = sessionStorage.getItem("resetEmail");
      if (storedEmail) setEmail(storedEmail);
    } else {
      const emailFromURL = searchParams.get("email") || "";
      setEmail(emailFromURL);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !email) {
      toast.error("Missing OTP or email.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (type === "register") {
        result = await authService.verifyOtp({ email, otp, role: userType });
        toast.success("OTP Verified! Please log in.");
        router.push(`/login/${result.data.data.role}`);
      } else if (type === "reset") {
        await passwordService.verifyResetPasswordOtp(userType, { email, otp });
        toast.success("OTP Verified! Create your new password.");
        sessionStorage.removeItem("resetEmail");
        router.push(`/changePassword/${userType}`);
      }
    } catch (error) {
      let message = "OTP Verification failed";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      if (type === "register") {
        await authService.resentOtp({ email });
        setTimeLeft(120);
        toast.info("New OTP sent!");
      }
    } catch (error) {
      let message = "Error resending OTP";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      toast.error(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#f16307]/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#e43a15]/5 blur-[120px] rounded-full animate-pulse delay-1000" />

      <div className="relative w-full max-w-md">
        {/* Outer Glow Effect */}
        <div className={`absolute -inset-1 bg-gradient-to-r ${brandGradient} rounded-[2.5rem] opacity-20 blur-xl`} />

        <div className="relative bg-[#111111]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          
          {/* Internal Accent Light */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f16307]/10 blur-3xl rounded-full" />

          <div className="text-center mb-10">
            <div className="relative inline-flex mb-6">
              <div className="absolute -inset-3 bg-[#f16307]/20 blur-lg rounded-full animate-pulse" />
              <div className="relative p-5 bg-zinc-900 border border-zinc-800 rounded-3xl">
                <ShieldCheck className={`w-10 h-10 ${accentColor}`} />
              </div>
            </div>
            
            <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
              Verify <span className={`bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent`}>Identity</span>
            </h2>
            <div className="flex flex-col items-center gap-2">
              <p className="text-zinc-500 text-sm font-medium">
                We&apos;ve sent a 6-digit code to
              </p>
              <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/50 border border-zinc-800 rounded-full">
                <Mail size={14} className="text-zinc-400" />
                <span className="text-zinc-200 text-xs font-bold">{email}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="0 0 0 0 0 0"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="w-full tracking-[1em] text-center text-2xl font-black py-5 bg-zinc-950 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-800 focus:ring-4 focus:ring-[#f16307]/10 focus:border-[#f16307] outline-none transition-all duration-300"
                />
              </div>
              
              {/* Timer UI */}
              <div className="flex justify-center items-center gap-2 py-2">
                <Timer size={16} className={timeLeft > 0 ? "text-zinc-500" : "text-red-500"} />
                <span className={`text-sm font-mono font-bold ${timeLeft > 0 ? "text-zinc-400" : "text-red-500"}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className={`relative w-full group overflow-hidden py-4.5 px-6 rounded-2xl text-white font-black text-lg transition-all transform active:scale-[0.96] shadow-2xl shadow-[#f16307]/20 disabled:opacity-50 disabled:scale-100 disabled:shadow-none`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${brandGradient} group-hover:scale-105 transition-transform duration-500`} />
              <span className="relative flex items-center justify-center gap-3">
                {loading ? "Verifying..." : "Confirm Code"}
              </span>
            </button>
          </form>

          {/* Footer Actions */}
          <div className="mt-10 pt-8 border-t border-zinc-800/50 flex flex-col items-center gap-6">
            <button
              onClick={handleResendOtp}
              disabled={timeLeft > 0 || resendLoading}
              className={`flex items-center gap-2 text-sm font-bold transition-all ${
                timeLeft > 0 
                ? "text-zinc-700 cursor-not-allowed" 
                : "text-zinc-400 hover:text-white"
              }`}
            >
              <RotateCw size={16} className={resendLoading ? "animate-spin" : ""} />
              {resendLoading ? "Resending..." : "Resend OTP"}
            </button>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-bold transition-all text-xs group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Change Email Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}