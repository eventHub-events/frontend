import EventAnalyticsPage from "@/components/organizer/event-analytics/EventAnalytics";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export  default function OrganizerReviewPage (){
 
  
  return (
     <ProtectedRoute allowedRoles={["organizer"]}>
          <div > 
           <EventAnalyticsPage/>
          </div>
     </ProtectedRoute>
  )
}