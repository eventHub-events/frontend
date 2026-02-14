"use client"
import { useState } from "react";
import ForgetPasswordForm from "@/components/ui/ForgetPassword";
import Spinner from "@/components/ui/Spinner";
import Footer from "@/components/user/landing/Footer";
import Header from "@/components/user/landing/Header";
import { passwordService } from "@/services/user/passwordService";
import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
import { useNotify } from "@/components/ui/NotifyContext";
import axios from "axios";
 
export default function UserForgetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const{notify} = useNotify();

  const handleSubmit = async (email: string, role: "user" | "organizer") => {
    try {
      setLoading(true);
      sessionStorage.setItem("resetEmail", email);
      const result = await passwordService.forgetPassword(role, { email });
      if (result) {
        // toast.success("Success! Please enter the OTP");
         notify("Request Sent", "Check your inbox for thr recovery code.", "success")
        router.push(`/verify-otp/${role}?type=reset`);
      }
    } catch (err: unknown) {
      console.log("FULL AXIOS ERROR:", err);

      let backendMessage = "Something went wrong";
      if (axios.isAxiosError(err)) {
        backendMessage =
          err.response?.data?.message || err.response?.data?.error || err.message || backendMessage;
      } else if (err instanceof Error) {
        backendMessage = err.message;
      }

      notify("Failed", backendMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Spinner />
            <p className="text-zinc-500 font-medium animate-pulse">Requesting reset...</p>
          </div>
        ) : (
          <ForgetPasswordForm role="user" onSubmit={handleSubmit} />
        )}
      </main>
      <Footer />
    </div>
  );
}