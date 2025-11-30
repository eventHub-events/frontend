 "use client";
import React from "react";
import Sidebar from "@/components/admin/ui/SideBar";
import Navbar from "@/components/admin/ui/NavBar";

import ProtectedRoute from "@/components/user/auth/RoleProtection";
import AdminDashboardPage from "@/components/admin/dashboard/parts/AdminDashboard";


const DashboardPage = () => {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <Navbar />

        <div className="ml-64 pt-20">
          <main className="p-6">
            <AdminDashboardPage />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
