import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./SideBarContent";
import { getAllSallerAndBuyer } from "@/services/accountService";
import { use } from "react";
import { StatusCheckAction } from "@/actions/applecationAction";
import { StatusCheck } from "@/services/applecationService";

const list = [
  {
    title: "صفحه اصلی",
    url: "/customer/home",
    icon: <img src="../house.png" className="size-7" />,
  },
  {
    title: "صورت حساب ها",
    url: "/customer/account",
    icon: <img src="../man.png" className="size-7" />,
  },
  {
    title: "تنظیمات",
    url: "/customer/setting",
    icon: <img src="../technology.png" className="size-7" />,
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
    title: "صندوق ورودی",
    url: "/customer/applecation",
    icon: <img src="../online-registration.png" className="size-7" />,
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
      {
        title: "انتقال پول ",
        url: "/customer/transfer",
        icon: <img src="../transfer.png" className="size-7" />,
      },
    ],
  },
  {
    title: "گزارشات مختصر",
    url: "/customer/abridgedReportage",
    icon: <img src="../documentation.png" className="size-7" />,
  },
  {
    title: "گزارشات مفصل ",
    url: "/customer/executtiveReportage",
    icon: <img src="../folder.png" className="size-7" />,
  },
];

export async function AppSidebar() {
  const count = await StatusCheck();

  return (
    <Sidebar>
      <AppSidebarContent list={list} count={count.result} />
    </Sidebar>
  );
}
