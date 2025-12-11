 "use client";
import React from "react";
import ProtectedRoute from "@/components/user/auth/RoleProtection";
import CategoriesTagsManagement from "@/components/admin/category/CategoryManagement";

const CategoryManagement = () => {
  return (
      <ProtectedRoute allowedRoles={["admin"]}>

   
          <CategoriesTagsManagement />
       
      </ProtectedRoute>
  );
};

export default CategoryManagement;
