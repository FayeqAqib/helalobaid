import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

export const metadata = {
  title: "SHUKRULLAH AJMAL",
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
      <body
        style={{ fontFamily: "'Scheherazade New', serif" }}
        // className={gulzar.className}
      >
        <SessionProvider>
          <Toaster />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
