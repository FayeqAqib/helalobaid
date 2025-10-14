import "../globals.css";
import { AppSidebar } from "@/components/myUI/appSideBar";
import { ThemeProvider } from "@/components/theme-provider";

import { auth } from "@/lib/auth";
import { SidebarChildren } from "@/components/ui/sidebar";

import { redirect } from "next/navigation";

// import { redirect } from "next/navigation";
// import { auth } from "@/lib/auth";

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
      <AppSidebar />
      <SidebarChildren>
        <main className="p-6 pt-22   ">{children}</main>
      </SidebarChildren>
    </ThemeProvider>
  );
}
