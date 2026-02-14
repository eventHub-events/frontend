"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";

// Icons & Validation
import { Mail, Lock, User, Phone, Ticket, Sparkles, UserPlus } from "lucide-react"; 
import { authService } from "../../services/authService";
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/authSlice";
import { setOrganizer } from "@/redux/slices/organizer/authSlice";
import { validateConfirmPassword, validateEmail, validateName, validatePassword, validatePhone } from "@/utils/validation";
import { useNotify } from "./NotifyContext";

// Premium Notification Hook


interface SignupPageProps {
  userType: "user" | "organizer";
}

export default function SignupPage({ userType }: SignupPageProps) {
  const isUser = userType === "user";
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notify } = useNotify(); // Initialize global notification

  // Brand Match Logic
  const brandGradient = "from-[#f16307] to-[#e43a15]"; 
  const accentColor = "text-[#f16307]";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: userType
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) {
        notify("Auth Error", "Google authentication token not found.", "error");
        return;
      }
      const response = await authService.googleLogin({ token, role: userType });
      const { data } = response.data;

      notify("Welcome!", "Successfully joined via Google.", "success");

      if (data.role === "user") {
        dispatch(setUser(data));
        router.push("/user/home");
      } else if (data.role === "organizer") {
        dispatch(setOrganizer(data));
        router.push("/organizer/dashboard");
      }
    } catch (error: unknown) {
      let message = "Google login failed";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify("Auth Failed", message, "error");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    let error = "";
    switch (name) {
      case "name": error = validateName(value); break;
      case "email": error = validateEmail(value); break;
      case "phone": error = validatePhone(value); break;
      case "password": error = validatePassword(value); break;
      case "confirmPassword": error = validateConfirmPassword(value, form.password); break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((msg) => msg !== "");
    if (hasErrors) {
      notify("Form Errors", "Please correct the highlighted fields before submitting.", "warning");
      return;
    }

    try {
      setLoading(true);
      await authService.signup(form);
      notify("Account Created", "Check your email for the verification OTP.", "success");
      router.push(`/verify-otp/${userType}?email=${encodeURIComponent(form.email)}`);
    } catch (error) {
      let message = "Signup failed";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }
      notify("Signup Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#f16307]/30">
      
      {/* Left Side: Branding Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#f16307]/10 blur-[130px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#e43a15]/10 blur-[130px]"></div>
        </div>
        
        <div className="relative z-10 p-12 text-center">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] mb-10 shadow-2xl animate-bounce-slow">
             <Sparkles className={`w-14 h-14 ${accentColor}`} />
          </div>
          <h2 className="text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
            Start Your <br /> 
            <span className={`bg-gradient-to-r ${brandGradient} bg-clip-text text-transparent`}>
                Journey
            </span> With Us.
          </h2>
          <p className="text-zinc-400 text-xl max-w-sm mx-auto leading-relaxed">
            {isUser 
              ? "Join the community to discover and attend the best events." 
              : "Empower your community by hosting world-class experiences."}
          </p>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f0f0f] overflow-y-auto">
        <div className="w-full max-w-[440px] py-12">
          
          <div className="mb-10">
            <h3 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
              Join Now <UserPlus className={accentColor} size={32} />
            </h3>
            <p className="text-zinc-500 text-lg">
              Create your <span className="text-zinc-200 font-medium">{userType}</span> account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div className="space-y-1">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                />
              </div>
              {errors.name && <p className="text-red-500 text-[10px] ml-2 font-bold uppercase tracking-wider">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] ml-2 font-bold uppercase tracking-wider">{errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-[10px] ml-2 font-bold uppercase tracking-wider">{errors.phone}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                    />
                  </div>
                  {errors.password && <p className="text-red-500 text-[10px] ml-2 font-bold uppercase tracking-wider">{errors.password}</p>}
               </div>
               <div className="space-y-1">
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={18} />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm"
                      className="w-full pl-12 pr-4 py-3.5 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-[10px] ml-2 font-bold uppercase tracking-wider">{errors.confirmPassword}</p>}
               </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 mt-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.97] shadow-xl shadow-[#f16307]/20 bg-gradient-to-r ${brandGradient} disabled:opacity-50 hover:brightness-110`}
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Ticket size={22} />
                  Get Started
                </>
              )}
            </button>
          </form>

          {/* Social Section */}
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] bg-zinc-800 flex-1"></div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Social Signup</span>
              <div className="h-[1px] bg-zinc-800 flex-1"></div>
            </div>
            
            <div className="flex justify-center transition-transform hover:scale-[1.01]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => notify("Auth Error", "Google registration was cancelled.", "error")}
                useOneTap
                width="440"
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>

          <p className="text-center mt-10 text-zinc-500">
            Already part of the hub?{" "}
            <Link href={`/login/${userType}`} className={`font-black ${accentColor} hover:underline decoration-2 underline-offset-4`}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}