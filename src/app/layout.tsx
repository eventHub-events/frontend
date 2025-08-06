"use client"
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "@/redux/Providers";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
        
        <main>{children}</main>
       
        
        
        <ToastContainer 
          position="top-center" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
        </Providers>
      </body>
    </html>
  );
}
