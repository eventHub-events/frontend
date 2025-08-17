"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import type { AxiosError } from "axios";
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
  const [timeLeft, setTimeLeft] = useState(120); // 2 min timer
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<"register" | "reset">("register");

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle email & type
  useEffect(() => {
    const t = (searchParams.get("type") || "register") as "register" | "reset";
    setType(t);

    if (t === "reset") {
      const storedEmail = sessionStorage.getItem("resetEmail");
      if (storedEmail) {
        setEmail(storedEmail);
      }
    } else {
      const emailFromURL = searchParams.get("email") || "";
      setEmail(emailFromURL);
    }
  }, [searchParams]);

  // Handle OTP submit
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
        result = await passwordService.verifyResetPasswordOtp(userType, { email, otp });
        toast.success("OTP Verified! You can now change your password.");
        sessionStorage.removeItem("resetEmail");
        router.push(`/changePassword/${userType}`);
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      if (type === "register") {
        await authService.resentOtp({ email });
        setTimeLeft(120);
        toast.info("New OTP sent!");
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err?.response?.data?.message || "Error resending OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2
          className={`text-2xl font-bold mb-4 ${
            isUser ? "text-purple-600" : "text-orange-600"
          }`}
        >
          {isUser ? "Verify Your Account" : "Organizer OTP Verification"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Please enter the OTP sent to <span className="font-semibold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-sm text-center focus:ring-2 focus:ring-purple-500"
          />

          <button
            type="submit"
            disabled={loading || !otp}
            className={`w-full py-2 rounded-lg text-white font-medium ${
              isUser
                ? "bg-gradient-to-r from-purple-500 to-blue-500"
                : "bg-gradient-to-r from-orange-500 to-red-500"
            }`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Timer & Resend */}
        <div className="mt-4 text-center text-sm">
          {timeLeft > 0 ? (
            <p>
              Resend OTP in{" "}
              <span className="font-semibold">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-purple-600 font-semibold"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Back button */}
        <button
          className="mt-4 text-sm text-gray-600 hover:underline"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
