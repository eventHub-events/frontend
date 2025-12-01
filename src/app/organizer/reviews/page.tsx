



import OrganizerReviews from "@/components/organizer/review/OrganizerReviews";
import ProtectedRoute from "@/components/user/auth/RoleProtection";



export  default function OrganizerReviewPage (){
 
  
  return (
     <ProtectedRoute allowedRoles={["organizer"]}>
          <div > 
       <OrganizerReviews/ >
          </div>
     </ProtectedRoute>
  )
}