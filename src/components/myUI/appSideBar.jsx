import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./SideBarContent";
import { getAllSallerAndBuyer } from "@/services/accountService";

export async function AppSidebar() {
  const getAllAccount = await getAllSallerAndBuyer({ type: "" });
  return (
    <Sidebar>
      <AppSidebarContent getAllAccount={getAllAccount.result} />
    </Sidebar>
  );
}
