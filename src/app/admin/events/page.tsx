import AdminEventManagementPage from "@/components/admin/event-management/EventManagement";

import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function EventManagementPage (){
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
     
            <AdminEventManagementPage/>
         

    </ProtectedRoute>
  )
}