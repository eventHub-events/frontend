"use client";
import React, { useState } from "react";
import { Mail, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

type ForgetPasswordFormProps = {
  role: "user" | "organizer";
  onSubmit: (email: string, role: "user" | "organizer") => void;
};

export default function ForgetPasswordForm({
  role,
  onSubmit,
}: ForgetPasswordFormProps) {
  const [email, setEmail] = useState("");

  // EventHub Core Palette
  const brandGradient = "from-[#f16307] via-[#e43a15] to-[#f16307]";
  const accentColor = "text-[#f16307]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    onSubmit(email.trim(), role);
  };

  return (
    <div className="relative flex justify-center items-center min-h-[85vh] px-4 bg-[#0a0a0a] overflow-hidden">
      
      {/* Dynamic Background Elements - Matches your Landing Page vibe */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f16307]/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e43a15]/5 blur-[120px] rounded-full animate-pulse delay-700" />

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        
        {/* Decorative Outer Glow */}
        <div className={`absolute -inset-1 bg-linear-to-r ${brandGradient} rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-40 transition duration-1000`} />

        <div className="relative bg-[#111111]/80 backdrop-blur-2xl border border-white/5 shadow-2xl rounded-[2.5rem] p-10 overflow-hidden">
          
          {/* Subtle Internal Mesh Gradient */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#f16307]/10 blur-3xl rounded-full" />

          <div className="text-center mb-10">
            <div className="relative inline-flex mb-6">
               <div className="absolute -inset-4 bg-[#f16307]/20 blur-xl rounded-full animate-pulse" />
               <div className="relative p-5 bg-zinc-900 border border-zinc-800 rounded-3xl shadow-inner">
                 <ShieldCheck className={`w-10 h-10 ${accentColor}`} />
               </div>
            </div>
            
            <h2 className="text-4xl font-black text-white mb-3 tracking-tighter leading-tight">
              Lost your <br />
              <span className={`bg-linear-to-r ${brandGradient} bg-clip-text text-transparent`}>Access?</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Don&apos;t worry. Enter your email and we&apos;ll help you get back to the Hub.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center ml-1">
                <label htmlFor="email" className="text-xs font-black text-zinc-500 uppercase tracking-[0.15em]">
                  Registered Email
                </label>
                <Sparkles size={14} className="text-[#f16307]/40" />
              </div>
              
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-all duration-300" size={20} />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-12 pr-4 py-4.5 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-700 focus:ring-4 focus:ring-[#f16307]/10 focus:border-[#f16307] outline-none transition-all duration-300"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`relative w-full group overflow-hidden py-4.5 px-6 rounded-2xl text-white font-black text-lg transition-all transform active:scale-[0.96] shadow-2xl shadow-[#f16307]/20`}
            >
              <div className={`absolute inset-0 bg-linear-to-r ${brandGradient} group-hover:scale-105 transition-transform duration-500`} />
              <span className="relative flex items-center justify-center gap-3">
                Send Recovery Code
              </span>
            </button>
          </form>

          <div className="mt-10 text-center border-t border-zinc-800/50 pt-8">
            <Link 
              href={`/login/${role}`} 
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-white font-bold transition-all duration-300 text-sm group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Back to Secure Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}