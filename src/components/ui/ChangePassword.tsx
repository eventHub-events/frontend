"use client";
import React, { useState } from "react";
import * as Yup from "yup";
import { ValidationError } from "yup";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, Circle } from "lucide-react";

type ChangePasswordFormProps = {
  role: "user" | "organizer";
  onSubmit: (role: "user" | "organizer", data: { password: string; confirmPassword: string }) => void;
};

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "At least 8 characters")
    .max(16, "Max 16 characters")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/\d/, "At least one number")
    .matches(/[@$!%*?&]/, "At least one special character"),
  confirmPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export default function ChangePasswordForm({ role, onSubmit }: ChangePasswordFormProps) {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  // Brand Match Logic
  const brandGradient = "from-[#f16307] via-[#e43a15] to-[#f16307]";
  const accentColor = "text-[#f16307]";

  // Real-time Strength Checkers
  const requirements = [
    { label: "8-16 characters", test: (val: string) => val.length >= 8 && val.length <= 16 },
    { label: "Upper & lowercase", test: (val: string) => /[A-Z]/.test(val) && /[a-z]/.test(val) },
    { label: "Number & Symbol", test: (val: string) => /\d/.test(val) && /[@$!%*?&]/.test(val) },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      onSubmit(role, formData);
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-[85vh] px-4 bg-[#0a0a0a] overflow-hidden">
      {/* Background Mesh Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f16307]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#e43a15]/5 blur-[120px] rounded-full" />

      <div className="relative w-full max-w-md">
        <div className={`absolute -inset-1 bg-linear-to-r ${brandGradient} rounded-[2.5rem] opacity-20 blur-xl`} />

        <div className="relative bg-[#111111]/90 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex p-5 bg-zinc-900 border border-zinc-800 rounded-3xl mb-6 shadow-inner relative">
              <ShieldCheck className={`w-10 h-10 ${accentColor}`} />
              <div className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f16307] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#f16307]"></span>
              </div>
            </div>
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create New Password</h2>
            <p className="text-zinc-500 text-sm font-medium">Your security is our top priority.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white focus:ring-4 focus:ring-[#f16307]/10 focus:border-[#f16307] outline-none transition-all"
                  placeholder="••••••••••••"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Password Strength Checklist */}
            <div className="grid grid-cols-1 gap-2 px-1">
              {requirements.map((req, idx) => {
                const isMet = req.test(formData.password);
                return (
                  <div key={idx} className="flex items-center gap-2 transition-all duration-500">
                    {isMet ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <Circle size={14} className="text-zinc-700" />
                    )}
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${isMet ? 'text-zinc-300' : 'text-zinc-600'}`}>
                      {req.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-zinc-500 uppercase tracking-widest ml-1">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-white focus:ring-4 focus:ring-[#f16307]/10 focus:border-[#f16307] outline-none transition-all"
                  placeholder="••••••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] font-black uppercase tracking-wider ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className={`relative w-full group overflow-hidden py-4.5 px-6 rounded-2xl text-white font-black text-lg transition-all transform active:scale-[0.96] shadow-2xl shadow-[#f16307]/20`}
            >
              <div className={`absolute inset-0 bg-linear-to-r ${brandGradient} group-hover:scale-105 transition-transform duration-500`} />
              <span className="relative">Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}