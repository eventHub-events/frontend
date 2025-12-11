import PayoutsPage from "@/components/admin/finance/Payout";
import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function PayoutsRoutePage() {

  return(
  <ProtectedRoute allowedRoles={["admin"]}>

    <PayoutsPage/>;
  </ProtectedRoute>
  )
}
