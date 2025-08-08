// app/admin/dashboard/layout.tsx
import ProtectedRoute from "@/components/user/auth/RoleProtection";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>

    <div>
     
      {children}
    </div>
    </ProtectedRoute>
  );
}
