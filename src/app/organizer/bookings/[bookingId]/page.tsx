
"use client"
import BookingDetails from "@/components/organizer/booking/BookingDetail";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function BookingDetailsPage (){
  return(
    <ProtectedRoute allowedRoles={["organizer"]}>
       <div > 
      <BookingDetails/>
      </div>
    </ProtectedRoute>
  )

}