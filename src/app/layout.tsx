import "./globals.css";
import Header from "../components/user/landing/Header";
import Footer from "../components/user/landing/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header /> {/* Always show header */}
        <main>{children}</main>
        <Footer /> {/* Always show footer */}
      </body>
    </html>
  );
}
