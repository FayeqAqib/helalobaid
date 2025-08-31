import { SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/myUI/Header";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { VendeeAppSidebar } from "@/components/myUI/vendeeAppSideBar";
import TextMarquee from "@/components/myUI/TextMarquee";

export default async function RootLayout({ children }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  if (
    session.user._doc.role === "employe" ||
    session.user._doc.role === "admin"
  ) {
    return redirect("/customer/home");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <VendeeAppSidebar />

        <div className="w-full">
          <Header />
          <TextMarquee />
          <main className="p-6 ">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
