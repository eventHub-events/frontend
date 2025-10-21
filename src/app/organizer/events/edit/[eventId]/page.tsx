import EventFormPage from "@/components/organizer/events/EventForm";
import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function EditEventPage () {
  return(
    <ProtectedRoute allowedRoles={["organizer"]}>
      <EventFormPage />
    </ProtectedRoute>
  )
}