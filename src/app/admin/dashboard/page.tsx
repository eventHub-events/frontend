 "use client";
import React from "react";


import ProtectedRoute from "@/components/user/auth/RoleProtection";
import AdminDashboardPage from "@/components/admin/dashboard/parts/AdminDashboard";


const DashboardPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
     
            <AdminDashboardPage />
        
    </ProtectedRoute>
  );
};

export default DashboardPage;
