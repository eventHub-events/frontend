import OrganizerChat from "@/components/organizer/chat/OrganizerChatComponent";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function MessagePage() {
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
         <div > 
      <OrganizerChat />
    </div>
    </ProtectedRoute>
   
  );
}