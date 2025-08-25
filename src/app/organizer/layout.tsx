"use client"
import { OrganizerNavbar } from "@/components/organizer/OrganizerNavbar";
import { OrganizerSidebar } from "@/components/organizer/OrganizerSidebar";
import { useAuthSocket } from "@/hooks/useAuthSocket";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
   useAuthSocket()
  return (
    <div className="flex flex-col h-screen">
      <OrganizerNavbar />
      <div className="flex flex-1">
        <OrganizerSidebar />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
