
import EventAnalyticsAdmin from "@/components/admin/admin-event-analytics/AdminEventAnalytics";


import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function EventAnalytics() {

  return(
  <ProtectedRoute allowedRoles={["admin"]}>

    <EventAnalyticsAdmin/>
  </ProtectedRoute>
  )
}
