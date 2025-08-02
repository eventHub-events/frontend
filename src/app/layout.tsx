import "./globals.css";
import Header from "../components/user/landing/Header";
import Footer from "../components/user/landing/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Always show header */}
        <main>{children}</main>
        <Footer /> {/* Always show footer */}
        
        {/* Global Toast container - all pages can use toast.success(), toast.error() */}
        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </body>
    </html>
  );
}

