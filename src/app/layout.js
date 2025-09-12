import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata = {
  title: "MEGABYTE",
};
export default function RootLayout({ children }) {
  return (
    <html dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Scheherazade New', serif" }}>
        <SessionProvider>
          <Toaster />
          <SidebarProvider>{children}</SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
