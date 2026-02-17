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

interface LoginPageProps {
  userType: "user" | "organizer" | "admin";
}

const LoginPage: React.FC<LoginPageProps> = ({ userType }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { notify } = useNotify();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const organizer = useAppSelector((state) => state.organizerAuth.organizer);

  const brandGradient = "from-[#f16307] to-[#e43a15]";
  const accentColor = "text-[#f16307]";

  // 🔥 Prevent logged user going back to login page
  useEffect(() => {
    if (!organizer && !user) return;

    if (user) {
      router.replace("/user/home");
      return;
    }

    if (organizer) {
      if (!organizer.isProfileCompleted) {
        router.replace("/organizer/profile");
        return;
      }

      if (!organizer.isKycSubmitted) {
        router.replace("/organizer/profile?step=documents");
        return;
      }

      if (!organizer.isSubscribed) {
        router.replace("/organizer/subscription");
        return;
      }

      router.replace("/organizer/dashboard");
    }
  }, [organizer, user, router]);

  // 🔥 Normal login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      notify(
        "Input Required",
        "Please enter both email and password to proceed.",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login({ email, password });
      const data = response.data.data;

      notify("Welcome Back!", "Successfully signed into Event Hub.", "success");

      if (data.role === "admin") {
        router.replace("/admin/dashboard");
        return;
      }

      if (data.role === "user") {
        dispatch(setUser(data));
        router.replace("/user/home");
        return;
      }

      if (data.role === "organizer") {
        dispatch(setOrganizer(data));

        if (!data.isProfileCompleted) {
          router.replace("/organizer/profile");
          return;
        }

        if (!data.isKycSubmitted) {
          router.replace("/organizer/profile?step=documents");
          return;
        }

        if (!data.isSubscribed) {
          router.replace("/organizer/subscription");
          return;
        }

        router.replace("/organizer/dashboard");
      }
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message: string }>;
      notify(
        "Login Failed",
        axiosErr.response?.data?.message ||
          "Invalid credentials, please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google login
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;

      const response = await authService.googleLogin({
        token,
        role: userType,
      });

      const { data } = response.data;

      notify(
        "Google Login",
        "Successfully authenticated with Google.",
        "success"
      );

      if (data.role === "user") {
        dispatch(setUser(data));
        router.replace("/user/home");
        return;
      }

      if (data.role === "organizer") {
        dispatch(setOrganizer(data));

        if (!data.isProfileCompleted) {
          router.replace("/organizer/profile");
          return;
        }

        if (!data.isKycSubmitted) {
          router.replace("/organizer/profile?step=documents");
          return;
        }

        if (!data.isSubscribed) {
          router.replace("/organizer/subscription");
          return;
        }

        router.replace("/organizer/dashboard");
      }
    } catch (error) {
      console.log(error);
      notify("Auth Error", "Google authentication was unsuccessful.", "error");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#f16307]/30">
      {/* Left Branding */}
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
            <span
              className={`bg-linear-to-r ${brandGradient} bg-clip-text text-transparent`}
            >
              Adventure
            </span>{" "}
            Awaits.
          </h2>

          <p className="text-zinc-400 text-xl max-w-sm mx-auto leading-relaxed">
            Discover the most exciting events happening near you on{" "}
            <strong>Event Hub</strong>.
          </p>
        </div>
      </div>

      {/* Right Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f0f0f]">
        <div className="w-full max-w-[420px]">
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-white mb-3 flex items-center gap-3">
              Sign In <UserCheck className={accentColor} size={32} />
            </h3>
            <p className="text-zinc-500 text-lg">
              Manage your{" "}
              <span className="text-zinc-200 font-medium">{userType}</span>{" "}
              profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307]"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-zinc-400">
                  Password
                </label>
                <Link
                  href={`/forgetPassword/${userType}`}
                  className={`text-sm font-bold ${accentColor}`}
                >
                  Forgot?
                </Link>
              </div>

              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-[#f16307]"
                  size={20}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-white"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl text-white font-black text-lg flex items-center justify-center gap-3 bg-gradient-to-r ${brandGradient}`}
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

          {/* Google */}
          <div className="mt-10 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                notify("Auth Error", "Google authentication cancelled.", "error")
              }
              useOneTap
              width="420"
              theme="filled_black"
              shape="pill"
            />
          </div>

          <p className="text-center mt-10 text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href={`/signup/${userType}`}
              className={`font-black ${accentColor}`}
            >
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
