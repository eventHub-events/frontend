import OrganizerChat from "@/components/organizer/chat/OrganizerChatComponent";
import ProtectedRoute from "@/components/user/auth/RoleProtection";

export default function MessagePage() {
  return (
    <ProtectedRoute allowedRoles={["organizer"]}>
         <div className="ml-64 p-6"> 
      <OrganizerChat />
    </div>
    </ProtectedRoute>
   
  );
}