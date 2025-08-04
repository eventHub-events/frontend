"use client";
import type { AxiosError } from "axios";

import Link from "next/link";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { authService } from "../../services/authService"; // shared login API
import { useAppDispatch } from "@/redux/hooks";
import { setUser } from "@/redux/slices/user/authSlice";
import { GiConsoleController } from "react-icons/gi";

interface LoginPageProps {
  userType: "user" | "organizer" | "admin";
}

const LoginPage: React.FC<LoginPageProps> = ({ userType }) => {
  const router = useRouter();
  const isUser = userType === "user";
  const isOrganizer = userType === "organizer";
  const isAdmin = userType === "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch= useAppDispatch()

  // Handle login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      console.log("email and password",email,password)

      
      const response = await authService.login({ email, password });
      console.log("logggggg",response)

         dispatch(setUser(response.data.data))
         setTimeout(() => {
  toast.success("Login successful!");
}, 300);

     

      // Redirect dynamically based on userType
      if (isAdmin) router.push("/admin/dashboard");
      else if (isOrganizer) router.push("/organizer/dashboard");
      else router.push("/user/home");

    } catch (err: unknown) {

     const axiosErr = err as AxiosError<{ message: string }>;
     console.log("errr",axiosErr.response?.data)
  toast.error(axiosErr.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`p-3 rounded-full ${
              isUser
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : isOrganizer
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-gray-700 to-black"
            }`}
          >
            {isUser ? "👤" : isOrganizer ? "📅" : "🛡️"}
          </div>
          <h2
            className={`text-xl font-bold mt-3 ${
              isUser ? "text-purple-600" : isOrganizer ? "text-orange-600" : "text-gray-700"
            }`}
          >
            Welcome Back, {isUser ? "User" : isOrganizer ? "Organizer" : "Admin"}!
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            {isUser
              ? "Sign in to discover amazing events."
              : isOrganizer
              ? "Sign in to manage your events."
              : "Sign in to manage the platform."}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          <a href="#" className="text-xs text-right block text-blue-500">
            Forgot your password?
          </a>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg text-white ${
              isUser
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : isOrganizer
                ? "bg-gradient-to-r from-orange-500 to-red-500"
                : "bg-gradient-to-r from-gray-700 to-black"
            }`}
          >
            {loading ? "Signing in..." : `Sign In to ${isUser ? "User" : isOrganizer ? "Organizer" : "Admin"} Account`}
          </button>
        </form>

        {/* Google Login */}
        <div className="flex items-center gap-2 my-4">
          <div className="h-[1px] bg-gray-300 flex-1"></div>
          <span className="text-xs text-gray-400">or continue with</span>
          <div className="h-[1px] bg-gray-300 flex-1"></div>
        </div>
        <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2">
          <FcGoogle />
          <span>Continue with Google</span>
        </button>

        <p className="text-xs text-center mt-4">
          {"Don't have an account? "}
          <Link href="/signup" className="text-blue-500">
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
