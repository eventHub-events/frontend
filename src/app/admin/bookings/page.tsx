import AdminBookingList from "@/components/admin/booking/AdminBookingList";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function AdminBookingsListPage () {
  
    return (
      <ProtectedRoute allowedRoles={["admin"]}>

  
          <AdminBookingList />
      
      </ProtectedRoute>
  );
  
}