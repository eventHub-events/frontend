"use client";

import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

interface LoginPageProps {
  userType: "user" | "organizer";
}

const LoginPage: React.FC<LoginPageProps> = ({ userType }) => {
  const isUser = userType === "user";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div
            className={`p-3 rounded-full ${
              isUser
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gradient-to-r from-orange-500 to-red-500"
            }`}
          >
            {isUser ? "👤" : "📅"}
          </div>
          <h2
            className={`text-xl font-bold mt-3 ${
              isUser ? "text-purple-600" : "text-orange-600"
            }`}
          >
            Welcome Back, {isUser ? "User" : "Organizer"}!
          </h2>
          <p className="text-gray-500 text-sm text-center mt-2">
            {isUser
              ? "Sign in to discover amazing events and book your next adventure."
              : "Sign in to manage your events and reach your audience."}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Your email"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg"
          />
          <a href="#" className="text-xs text-right block text-blue-500">
            Forgot your password?
          </a>
          <button
            type="submit"
            className={`w-full p-3 rounded-lg text-white ${
              isUser
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gradient-to-r from-orange-500 to-red-500"
            }`}
          >
            Sign In to {isUser ? "User" : "Organizer"} Account
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
