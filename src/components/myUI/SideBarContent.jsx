"use client";

import { HiMiniPresentationChartBar } from "react-icons/hi2";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { signOutAction } from "@/actions/user";
import Image from "next/image";
import { Label } from "../ui/label";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

// Menu items.

export function AppSidebarContent({ list }) {
  const path = usePathname();
  const [isActive, setIsActive] = useState(path);
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className={"flex-col gap-2"}>
            <div className="relative w-[70%] mx-5 h-[90px]">
              <Image src="/Ajmal.png" fill className="absolute " alt="image" />
            </div>
            <div className="flex h-[45px] flex-col italic justify-center  items-center w-full">
              <Label
                className={
                  "font-extralight text-3xl bg-gradient-to-tr from-white dark:from-black via-slate-400 dark:via-slate-500 to-slate-950 dark:to-white bg-clip-text text-transparent  uppercasexz px-1 "
                }
              >
                MEGABYTE
              </Label>
            </div>
          </SidebarHeader>

          <SidebarGroupContent>
            <SidebarMenu>
              {list.map((item) => {
                if (!item?.child) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        size="lg"
                        isActive={item.url === isActive}
                        onClick={() => setIsActive(item.url)}
                      >
                        <Link href={item.url}>
                          <span> {item.icon}</span>
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                } else {
                  return (
                    <Collapsible key={item.title} className="group/collapsible">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild size="lg">
                            <Link href={"#"} className="  ">
                              <span>{item.icon}</span>

                              {item.title}
                            </Link>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="flex flex-row">
                          <SidebarMenuSub>
                            {item?.child?.map((subItem, i) => (
                              <SidebarMenuSubItem key={i}>
                                <SidebarMenuButton
                                  asChild
                                  size="lg"
                                  isActive={subItem.url === isActive}
                                  onClick={() => setIsActive(subItem.url)}
                                >
                                  <Link href={subItem.url} className=" ">
                                    <span>{subItem.icon}</span>

                                    {subItem.title}
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          type="button"
          onClick={async () => await signOutAction()}
          className={"cursor-pointer"}
        >
          <img src="../close.png" className="size-7" />
          <span>خروج</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
