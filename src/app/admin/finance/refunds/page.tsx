import RefundOverview from "@/components/admin/finance/RefundOverview";
import RefundTable from "@/components/admin/finance/RefundTable";
import RefundTrendChart from "@/components/admin/finance/RefundTrendChart";
import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function RefundPage() {
  return (
   <ProtectedRoute allowedRoles={["admin"]}>

      <RefundOverview />
      <RefundTrendChart />
      <RefundTable />
   </ProtectedRoute>
   
  );
}
