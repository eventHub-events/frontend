// src/app/organizer/layout.tsx

import "@/app/globals.css";
import Header from "@/components/user/landing/Header";
import Footer from "@/components/user/landing/Footer";

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>

          <Header /> 
       
        <main className="p-6">{children}</main>
         <Footer /> 
        </div>
     
  );
}
