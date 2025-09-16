"use client"
import "./globals.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "@/redux/Providers";
import { Inter } from 'next/font/google'; 

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', 
});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}  >
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
      </body >
    </html>
  );
}
