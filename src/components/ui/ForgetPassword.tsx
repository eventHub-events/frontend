"use client";

import { useState } from "react";

type ForgetPasswordFormProps = {
  role: "user" | "organizer";
  onSubmit: (email: string, role: "user" | "organizer") => void;
};

export default function ForgetPasswordForm({
   role,
  onSubmit,
}: ForgetPasswordFormProps) {

  const[email,setEmail]=useState("");
  const handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault();
    if(!email.trim())return;
    onSubmit(email.trim(),role)
  }
  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="bg-white shadow-md rounded-md w-full max-w-md p-8">
        <h2 className="text-center text-lg font-semibold mb-6">Forget Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded hover:opacity-90 transition"
          >
            Send Request
          </button>
        </form>
      </div>
    </div>
  );
}
