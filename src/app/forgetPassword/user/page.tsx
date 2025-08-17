"use client"
import { useState } from "react";
import ForgetPasswordForm from "@/components/ui/ForgetPassword";
import Spinner from "@/components/ui/Spinner";
import Footer from "@/components/user/landing/Footer";
import Header from "@/components/user/landing/Header";
import { passwordService } from "@/services/user/passwordService";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function UserForgetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  

  const handleSubmit = async (email: string, role: "user" | "organizer") => {
    try {
      setLoading(true);
      console.log("user forget password:", email);
      sessionStorage.setItem("resetEmail",email)
      console.log("Session Email Set:", sessionStorage.getItem("resetEmail"));
      const result = await passwordService.forgetPassword(role, { email });
      if (result) {
        toast.success("Success! Please enter the OTP");
        router.push(`/verify-otp/${role}?type=reset`);
      }
    }  catch (err: unknown) {
  if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("Something went wrong");
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      {loading ? (
        <Spinner />
      ) : (
        <ForgetPasswordForm role="user" onSubmit={handleSubmit} />
      )}
      <Footer />
    </div>
  );
}
