"use client"
import "./globals.css";
import Header from "../components/user/landing/Header";
import Footer from "../components/user/landing/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Providers } from "@/redux/Providers";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
        <Header /> 
        <main>{children}</main>
        <Footer /> 
        
        
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
