// app/admin/dashboard/layout.tsx
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Optional: Shared navbar/sidebar here */}
      {children}
    </div>
  );
}
