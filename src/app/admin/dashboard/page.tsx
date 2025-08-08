"use client";
import React from "react";
import Sidebar from "@/components/admin/ui/SideBar";
import Navbar from "@/components/admin/ui/NavBar";
import AdminDashboard from "@/components/admin/dashboard/Dashboard";

const DashboardPage = () => {
  return (
    
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />
        <main className="mt-16 p-4">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
