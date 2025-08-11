import UserOrganizerManagement from "@/components/admin/dashboard/user&organizerManagement/UserOrganizerManagement";
import Navbar from "@/components/admin/ui/NavBar";
import Sidebar from "@/components/admin/ui/SideBar";
import ProtectedRoute from "@/components/user/auth/RoleProtection";



export default async  function  UserAndOrganizer(){
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
      
            <div className="flex-1 ml-64">
              <Navbar />
              <main className="mt-16 p-4">
                < UserOrganizerManagement />
              </main>
            </div>
          </div>

    </ProtectedRoute>
  )
}