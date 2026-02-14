import "./globals.css";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppProviders from "./providers";
import { NotifyProvider } from "@/components/ui/NotifyContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "EventHub",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <NotifyProvider>

          <main>{children}</main>
          </NotifyProvider>
        </AppProviders>
      </body>
    </html>
  );
}
