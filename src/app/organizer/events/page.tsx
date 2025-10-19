import { MyEvents } from "@/components/organizer/events/MyEvents";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function MyEventPage() {
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
      <div className="ml-64 p-6"> 
        {/* 👈 adjust ml-64 based on your sidebar width */}
        <MyEvents />
      </div>
    </ProtectedRoute>
  );
}
