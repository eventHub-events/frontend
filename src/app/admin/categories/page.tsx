 "use client";
import React from "react";
import Sidebar from "@/components/admin/ui/SideBar";
import Navbar from "@/components/admin/ui/NavBar";
import ProtectedRoute from "@/components/user/auth/RoleProtection";
import CategoriesTagsManagement from "@/components/admin/category/CategoryManagement";

const CategoryManagement = () => {
  return (
      <ProtectedRoute allowedRoles={["admin"]}>

    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />
        <main className="mt-16 p-4">
          <CategoriesTagsManagement />
        </main>
      </div>
    </div>
      </ProtectedRoute>
  );
};

export default CategoryManagement;
