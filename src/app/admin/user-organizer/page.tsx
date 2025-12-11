import UserOrganizerManagement from "@/components/admin/dashboard/user&organizerManagement/UserOrganizerManagement";

import ProtectedRoute from "@/components/user/auth/RoleProtection";



export default async  function  UserAndOrganizer(){
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
    
                < UserOrganizerManagement />
            

    </ProtectedRoute>
  )
}