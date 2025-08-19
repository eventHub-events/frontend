"use client";

import { toast } from "react-toastify";
import ForgetPasswordForm from "@/components/ui/ChangePassword";
import Header from "@/components/user/landing/Header";
import Footer from "@/components/user/landing/Footer";
import { passwordService } from "@/services/user/passwordService";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();

  // Updated function signature to match the component's expectation
  const handleSubmit = async (role: "user" | "organizer", data: { password: string; confirmPassword: string }) => {
    try {
      const result = await passwordService.changePassword(role, data);
      console.log("result", result);
      toast.success("Password changed successfully!");
      router.push(`/login/${result.data.data.role}`);
    } catch (err) {
      console.log(err);
      toast.error("Failed to change password");
    }
  };

  return (
    <>
      <Header />
      <ForgetPasswordForm role="user" onSubmit={handleSubmit} />
      <Footer />
    </>
  );
}