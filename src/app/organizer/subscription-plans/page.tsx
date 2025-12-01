import OrganizerSubscription from "@/components/organizer/subscription/OrganizerSubscription"
import ProtectedRoute from "@/components/user/auth/RoleProtection"

export default function OrganizationSubscriptionPage() {
  return (
      <ProtectedRoute allowedRoles={["organizer"]}>
        <div > 
       <OrganizerSubscription/>
       </div>
      </ProtectedRoute>
  )
}