"use client";

import { useSearchParams } from "next/navigation";
import ProtectedRoute from "@/components/user/auth/RoleProtection";
import BookingSuccess from "@/components/user/payment/success";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return (
      <div className="p-10 text-center text-red-600 text-xl">
        Invalid session
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <BookingSuccess sessionId={sessionId} />
    </ProtectedRoute>
  );
}
