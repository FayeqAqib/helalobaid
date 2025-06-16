import { SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";
import { AppSidebar } from "@/components/myUI/appSideBar";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/myUI/Header";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function RootLayout({ children }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full ">
          <Header />

          <main className="p-6 min-w-[500px]">{children}</main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
