import AdminBookingList from "@/components/admin/booking/AdminBookingList";
import Navbar from "@/components/admin/ui/NavBar";
import Sidebar from "@/components/admin/ui/SideBar";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function AdminBookingsListPage () {
  
    return (
      <ProtectedRoute allowedRoles={["admin"]}>

    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 ml-64">
        <Navbar />
        <main className="mt-16 p-4">
          <AdminBookingList />
        </main>
      </div>
    </div>
      </ProtectedRoute>
  );
  
}