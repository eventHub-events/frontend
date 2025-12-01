"use client"

import { OrganizerNavbar } from "@/components/organizer/OrganizerNavbar";
import { OrganizerSidebar } from "@/components/organizer/OrganizerSidebar";
import { useAuthSocket } from "@/hooks/useAuthSocket";
import { useOrganizerState } from "@/hooks/useOrganizerState";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
   useAuthSocket()
   useOrganizerState()
  return (
    
    <div className=" h-screen">
      <OrganizerNavbar />
         
        <OrganizerSidebar />
      <main className="ml-80 pt-24 px-8 overflow-auto">  {children}</main>
      </div>
    
   
  );
}
