
"use client"
import BookingDetails from "@/components/organizer/booking/BookingDetail";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function BookingDetailsPage (){
  return(
    <ProtectedRoute allowedRoles={["organizer"]}>
       <div className="ml-64 p-6"> 
      <BookingDetails/>
      </div>
    </ProtectedRoute>
  )

}