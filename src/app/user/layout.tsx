"use client"

import "@/app/globals.css";
import Header from "@/components/user/landing/Header";
import Footer from "@/components/user/landing/Footer";
import { useAuthSocket } from "@/hooks/useAuthSocket";
import { useUserState } from "@/hooks/useUserState";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  useAuthSocket()
  useUserState()
  return (
    <div>

          <Header /> 
       
        <main className="p-6">{children}</main>
         <Footer /> 
        </div>
     
  );
}
