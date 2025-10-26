import ProtectedRoute from "@/components/user/auth/RoleProtection";
import EventDetails from "@/components/user/events/EventDetails";

export default function EventDetailPage () {
  return(
    <ProtectedRoute allowedRoles={["user"]}>
      <EventDetails/>
    </ProtectedRoute>
  )
}