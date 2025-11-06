import ProtectedRoute from "@/components/user/auth/RoleProtection";
import UserBookings from "@/components/user/bookings/UserBooking";

export  default function UserBookingsListPage() {
  return (
        <ProtectedRoute allowedRoles={["user"]}>
          <UserBookings/>
        </ProtectedRoute>
     )
}