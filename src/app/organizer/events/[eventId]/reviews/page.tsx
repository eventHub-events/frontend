"use client"


import OrganizerEventReview from "@/components/organizer/review/OrganizerEventReviews";
import ProtectedRoute from "@/components/user/auth/RoleProtection";
import { useParams } from "next/navigation";


export  default function OrganizerEventReviewPage (){
  const {eventId  }  = useParams()
  
  return (
     <ProtectedRoute allowedRoles={["organizer"]}>
          <div className="ml-64 p-6"> 
       <OrganizerEventReview eventId={eventId as string }/>
          </div>
     </ProtectedRoute>
  )
}