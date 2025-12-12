import OrganizerDashboardDetail from "@/components/organizer/dashboard/details/OrganizerDashboardOverview";

import ProtectedRoute from "@/components/user/auth/RoleProtection";


export default function Page() {
  return (
     <ProtectedRoute allowedRoles={["organizer"]}>

       <OrganizerDashboardDetail />
     </ProtectedRoute>
  
  )
}
