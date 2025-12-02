"use client"

import OrganizerBookingList from "@/components/organizer/booking/Booking";
import ProtectedRoute from "@/components/user/auth/RoleProtection";
import { useParams } from "next/navigation";

export default function OrganizerBookingsPage () {
  const params = useParams();
  const eventId = params?.eventId as string | undefined;
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
      <div > 
      <OrganizerBookingList eventId={eventId!}/>
      </div>
    </ProtectedRoute>
  )
}