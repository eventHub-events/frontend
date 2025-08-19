"use client"
import { toast } from "react-toastify";

import Header from "@/components/user/landing/Header";
import Footer from "@/components/user/landing/Footer";
import { passwordService } from "@/services/user/passwordService";
import { useRouter } from "next/navigation";
import ForgetPasswordForm from "@/components/ui/ChangePassword";

export default function ChangePasswordPage() {
  const router = useRouter();

  const handleSubmit = async (role:"user"|"organizer",data: { password: string; confirmPassword: string }) => {
    try {
      const result = await passwordService.changePassword(role, data);
     if(result) toast.success("Password changed successfully!");
      router.push(`/login/${role}`);
    } catch (err:unknown) {
      if (err instanceof Error) {
    toast.error(err.message);
  } else {
    toast.error("Failed to change password");
  }
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
