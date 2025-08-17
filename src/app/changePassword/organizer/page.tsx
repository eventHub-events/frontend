"use client"
import { toast } from "react-toastify";

import Header from "@/components/user/landing/Header";
import Footer from "@/components/user/landing/Footer";
import { passwordService } from "@/services/user/passwordService";
import { useRouter } from "next/navigation";
import ForgetPasswordForm from "@/components/ui/ChangePassword";

export default function ChangePasswordPage() {
  const router = useRouter();

  const handleSubmit = async (data: { password: string; confirmPassword: string }) => {
    try {
      const result = await passwordService.changePassword("organizer", data);
      toast.success("Password changed successfully!");
      router.push("/login/organizer");
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  return (
    <>
      <Header />
      <ForgetPasswordForm role="organizer" onSubmit={handleSubmit} />
      <Footer />
    </>
  );
}
