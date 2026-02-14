"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Mail, Lock, Ticket, LayoutDashboard, UserCheck } from "lucide-react"; 
import { AxiosError } from "axios";

// Auth & Redux
import { authService } from "../../services/authService";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/authSlice";
import { setOrganizer } from "@/redux/slices/organizer/authSlice";
import { useNotify } from "./NotifyContext";

// Premium Notification Hook


interface LoginPageProps {
  userType: "user" | "organizer" | "admin";
}

const LoginPage: React.FC<LoginPageProps> = ({ userType }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notify } = useNotify(); // Initialize global notification
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);
  const active = user ? user : organizer;

  const isUser = userType === "user";
  const isOrganizer = userType === "organizer";

  const brandGradient = "from-[#f16307] to-[#e43a15]"; 
  const accentColor = "text-[#f16307]";

  useEffect(() => {
    if (active) {
      if (active === user) {
        router.push("/user/home");
      } else {
        router.push("/organizer/dashboard");
      }
    }
  }, [active, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notify("Input Required", "Please enter both email and password to proceed.", "warning");
      return;
    }
    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      const { role } = response.data.data;

      // Premium Success Notification
      notify("Welcome Back!", "Successfully signed into Event Hub.", "success");

      if (role === "admin") router.push("/admin/dashboard");
      else if (role === "organizer") {
        dispatch(setOrganizer(response.data.data));
        router.push("/organizer/dashboard");
      } else if (role === "user") {
        dispatch(setUser(response.data.data));
        router.push("/user/home");
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      // Premium Error Notification
      notify("Login Failed", axiosErr.response?.data?.message || "Invalid credentials, please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;
      const response = await authService.googleLogin({ token, role: userType });
      const { data } = response.data;

      notify("Google Login", "Successfully authenticated with Google.", "success");

      if (data.role === "user") {
        dispatch(setUser(data));
      } else {
        dispatch(setOrganizer(data));
      }
      router.push(data.role === "user" ? "/user/home" : "/organizer/dashboard");
    } catch (error: unknown) {
      console.log(error)
      notify("Auth Error", "Google authentication was unsuccessful.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#f16307]/30">
      
      {/* Left Side: Visual Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-[#f16307]/10 blur-[130px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#e43a15]/10 blur-[130px]"></div>
        </div>
        
        <div className="relative z-10 p-12 text-center">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] mb-10 shadow-2xl">
             <Ticket className={`w-14 h-14 ${accentColor} rotate-12`} />
          </div>
          <h2 className="text-6xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
            Your Next <br /> 
            <span className={`bg-linear-to-r ${brandGradient} bg-clip-text text-transparent`}>
                Adventure
            </span> Awaits.
          </h2>
          <p className="text-zinc-400 text-xl max-w-sm mx-auto leading-relaxed">
            Discover the most exciting events happening near you on <strong>Event Hub</strong>.
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f0f0f]">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
              Sign In <UserCheck className={accentColor} size={32} />
            </h3>
            <p className="text-zinc-500 text-lg">
              Manage your <span className="text-zinc-200 font-medium">{userType}</span> profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-zinc-400">Password</label>
                <Link href={`/forgetPassword/${userType}`} className={`text-sm font-bold ${accentColor} hover:brightness-125 transition-all`}>
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307] transition-colors" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-[#f16307]/20 focus:border-[#f16307] outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.97] shadow-xl shadow-[#f16307]/20 bg-gradient-to-r ${brandGradient} disabled:opacity-50 hover:brightness-110`}
            >
              {loading ? (
                <div className="h-6 w-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LayoutDashboard size={22} />
                  Sign In to Event Hub
                </>
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] bg-zinc-800 flex-1"></div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Quick Access</span>
              <div className="h-[1px] bg-zinc-800 flex-1"></div>
            </div>
            
            <div className="flex justify-center transition-transform hover:scale-[1.01]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => notify("Auth Error", "Google authentication was cancelled.", "error")}
                useOneTap
                width="420"
                theme="filled_black"
                shape="pill"
              />
            </div>
          </div>

          <p className="text-center mt-10 text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href={`/signup/${userType}`} className={`font-black ${accentColor} hover:underline decoration-2 underline-offset-4`}>
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;