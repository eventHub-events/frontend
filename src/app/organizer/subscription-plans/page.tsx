import OrganizerSubscription from "@/components/organizer/subscription/OrganizerSubscription"
import ProtectedRoute from "@/components/user/auth/RoleProtection"

export default function OrganizationSubscriptionPage() {
  return (
      <ProtectedRoute allowedRoles={["organizer"]}>
        <div className="ml-64 p-6"> 
       <OrganizerSubscription/>
       </div>
      </ProtectedRoute>
  )
}