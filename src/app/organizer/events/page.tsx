import { MyEvents } from "@/components/organizer/events/MyEvents";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function MyEventPage() {
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
      <div > 
     
        <MyEvents />
      </div>
    </ProtectedRoute>
  );
}
