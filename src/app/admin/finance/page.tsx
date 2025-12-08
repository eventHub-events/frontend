"use client"
import FinanceOverview from "@/components/admin/finance/FinanceOverView";

import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function FinanceOverviewPage (){
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
     
            <FinanceOverview/>
          

    </ProtectedRoute>
  )
}