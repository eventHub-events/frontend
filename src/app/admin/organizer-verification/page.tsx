import { OrganizeVerification } from "@/components/admin/OrganizerVerification"
import Navbar from "@/components/admin/ui/NavBar"
import Sidebar from "@/components/admin/ui/SideBar"
import ProtectedRoute from "@/components/user/auth/RoleProtection"




const OrganizeVerificationPage=()=>{
  return(
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar/>
        <div className="flex-1 ml-64">
          <Navbar/>
          <main className="mt-16 p-4">
            <OrganizeVerification/>
          </main>
        </div>
      </div>

    </ProtectedRoute>
  )

}
export default OrganizeVerificationPage