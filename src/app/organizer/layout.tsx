// app/organizer/layout.tsx
import { OrganizerNavbar } from "@/components/organizer/OrganizerNavbar";
import { OrganizerSidebar } from "@/components/organizer/OrganizerSidebar";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
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
