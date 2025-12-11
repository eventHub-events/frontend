import EventRevenueDashboard from "@/components/admin/finance/EventRevenueDashboard";

import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function EventRevenuePage() {

  return(
  <ProtectedRoute allowedRoles={["admin"]}>

    <EventRevenueDashboard/>;
  </ProtectedRoute>
  )
}
