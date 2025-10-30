import OrganizerBookingList from "@/components/organizer/booking/Booking";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function OrganizerBookingsPage () {
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
      <div className="ml-64 p-6"> 
      <OrganizerBookingList/>
      </div>
    </ProtectedRoute>
  )
}