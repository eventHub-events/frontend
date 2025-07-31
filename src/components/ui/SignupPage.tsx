"use client";

import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface SignupPageProps {
  userType: "user" | "organizer";
}

export default function SignupPage({ userType }: SignupPageProps) {
  const isUser = userType === "user";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <div className="flex flex-col items-center mb-6">
            <div
              className={`p-3 rounded-full ${
                isUser
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
            >
              <span className="text-white text-2xl">📅</span>
            </div>
            <h2
              className={`mt-4 text-2xl font-bold ${
                isUser ? "text-purple-600" : "text-orange-600"
              }`}
            >
              {isUser
                ? "Join as an Event User"
                : "Create Your Organizer Account"}
            </h2>
            <p className="text-gray-500 text-center text-sm mt-2">
              {isUser
                ? "Discover incredible events and create unforgettable memories"
                : "Start creating amazing events and building your community"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />

            <button
              type="submit"
              className={`w-full py-2 rounded-lg text-white font-medium ${
                isUser
                  ? "bg-gradient-to-r from-purple-500 to-blue-500"
                  : "bg-gradient-to-r from-orange-500 to-red-500"
              }`}
            >
              {isUser ? "Create User Account" : "Create Organizer Account"}
            </button>
          </form>

          {/* Google Button */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500 mb-2">or continue with</p>
            <button className="w-full border rounded-lg py-2 flex items-center justify-center gap-2">
             <FcGoogle />
              <span>Continue with Google</span>
            </button>
            
          </div>

          {/* Already have account */}
          <p className="text-xs text-center mt-4 text-gray-500">
            Already have an account?{" "}
            <Link
              href={`/login/${userType}`}
              className={`${
                isUser ? "text-purple-600" : "text-orange-600"
              } font-medium`}
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
