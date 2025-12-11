import SubscriptionPlansManagement from "@/components/admin/subscription-plans/SubscriptionPlansManagement";

import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function SubscriptionManagementPage() {
   return (
        <ProtectedRoute allowedRoles={["admin"]}>
          
                < SubscriptionPlansManagement />
             
           
        </ProtectedRoute>
    )
}