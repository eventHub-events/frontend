"use client";

import Sidebar from "@/components/admin/ui/SideBar";
import Navbar from "@/components/admin/ui/NavBar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="mt-16 p-6">{children}</main>
      </div>
    </div>
  );
}
