import AdminReports from "@/components/admin/report/AdminReport";

import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function AdminReportsPage(){
   return (
    <ProtectedRoute allowedRoles={["admin"]}>
      
            <AdminReports/>
        

    </ProtectedRoute>
   )
}
