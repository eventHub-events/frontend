

import SubscriptionDashboard from "@/components/admin/finance/SubscriptionDashboard";
import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function SubscriptionRevenuePage() {

  return(
  <ProtectedRoute allowedRoles={["admin"]}>

    <SubscriptionDashboard/>;
  </ProtectedRoute>
  )
}
