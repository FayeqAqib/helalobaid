"use client";

import { HiMiniPresentationChartBar } from "react-icons/hi2";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { signOutAction } from "@/actions/user";
import { useEffect, useState } from "react";

// Menu items.
const list = [
  {
    title: "صفحه اصلی",
    url: "/customer/home",
    icon: <img src="../house.png" className="size-7" />,
  },
  {
    title: "ثبت نام ",
    url: "/customer/account",
    icon: <img src="../man.png" className="size-7" />,
  },
  {
    title: "لیجر میتیو",
    url: "/customer/metuLedgar",
    icon: <img src="../ledger.png" className="size-7" />,
  },
  {
    title: "لیجر",
    url: "/customer/ledgar",
    icon: <img src="../ledger.png" className="size-7" />,
  },
  {
    title: "خرید",
    url: "/customer/buy",
    icon: <img src="../discount.png" className="size-7" />,
  },
  {
    title: "فروش",
    url: "/customer/sale",
    icon: <img src="../ewallet.png" className="size-7" />,
  },
  {
    title: "مصارف",
    url: "/customer/cost",
    icon: <img src="../calculate-cost.png" className="size-7" />,
  },
  {
    title: "عواید بیرونی",
    url: "/customer/externalProceed",
    icon: <img src="../money-bag.png" className="size-7" />,
  },
  {
    title: "معاملات",
    icon: <img src="../transaction-success.png" className="size-7" />,
    child: [
      {
        title: " پرداخت ها",
        url: "/customer/pay",
        icon: <img src="../payment.png" className="size-7" />,
      },
      {
        title: "در یافتی ها",
        url: "/customer/receive",
        icon: <img src="../money.png" className="size-7" />,
      },
    ],
  },
];

export function AppSidebarContent({ getAllAccount }) {
  const [items, setItems] = useState(list);
  useEffect(() => {
    if (getAllAccount.length > 0) {
      const newItems = getAllAccount
        .map((item) => {
          if (item.accountType === "company") return;
          return {
            title: item.label,
            url: `/customer/account/${item.value}`,
            icon:
              (item.accountType === "saller" && (
                <img src="../seller.png" className="size-7" />
              )) ||
              (item.accountType === "buyer" && (
                <img src="../investor.png" className="size-7" />
              )) ||
              (item.accountType === "bank" && (
                <img src="../bank.png" className="size-7" />
              )),
          };
        })
        .filter(Boolean);

      setItems((item) =>
        item.length === 10
          ? item
          : [
              ...item,

              {
                title: "گذارشات",
                icon: <img src="../health-report.png" className="size-7" />,
                child: newItems,
              },
            ]
      );
    }
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                if (!item?.child) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild size="lg">
                        <Link href={item.url} className="  ">
                          {item.icon}

                          <span>{item.title}</span>
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
                              {item.icon}

                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="flex flex-row">
                          <SidebarMenuSub>
                            {item?.child?.map((subItem, i) => (
                              <SidebarMenuSubItem key={i}>
                                <SidebarMenuButton asChild size="lg">
                                  <Link href={subItem.url} className="  ">
                                    {subItem.icon}

                                    <span>{subItem.title}</span>
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
