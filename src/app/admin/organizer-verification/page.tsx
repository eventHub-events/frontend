
import OrganizerVerification from "@/components/admin/OrganizerVerification"

import ProtectedRoute from "@/components/user/auth/RoleProtection"




const OrganizeVerificationPage=()=>{
  return(
    <ProtectedRoute allowedRoles={["admin"]}>
     
            <OrganizerVerification/>
       
    </ProtectedRoute>
  )

}
export default OrganizeVerificationPage