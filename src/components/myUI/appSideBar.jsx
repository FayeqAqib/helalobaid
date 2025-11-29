import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./SideBarContent";
import {
  ArrowLeftRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BanknoteX,
  BookUp,
  BookUp2,
  Boxes,
  BriefcaseBusiness,
  CircleDollarSign,
  CircleUser,
  Forklift,
  Hospital,
  HousePlus,
  LayoutDashboard,
  NotebookText,
  School,
  Settings,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
} from "lucide-react";

const list = [
  {
    title: "صفحه اصلی",
    url: "/customer/home",
    icon: <LayoutDashboard />,
  },
  {
    title: "صورت حساب ها",
    url: "/customer/account",
    icon: <CircleUser />,
  },
  {
    title: "تنظیمات",
    url: "/customer/setting",
    icon: <Settings />,
  },
  {
    title: "لیجر",
    url: "/customer/ledgar",
    icon: <NotebookText />,
  },

  {
    title: "خرید",
    url: "/customer/buy",
    icon: <ShoppingBasket />,
  },
  {
    title: "فروش",
    url: "/customer/sale",
    icon: <ShoppingBag />,
  },
  // {
  //   title: "  فروش pos",
  //   url: "/customer/pos",
  //   icon: <ShoppingCart />,
  // },
  {
    title: "مصارف",
    url: "/customer/cost",
    icon: <BanknoteX />,
  },
  {
    title: "عواید",
    url: "/customer/externalProceed",
    icon: <CircleDollarSign />,
  },
  {
    title: "گدام",
    icon: <Hospital />,
    child: [
      {
        title: "ایجاد گدام",
        url: "/customer/createDepot",
        icon: <HousePlus />,
      },
      {
        title: " ثبت موجودی",
        url: "/customer/depotInventory",
        icon: <Boxes />,
      },
      {
        title: "انتقال",
        url: "/customer/productTransfer",
        icon: <Forklift />,
      },
      {
        title: "گدام ها",
        url: "/customer/depotReportage",
        icon: <School />,
      },
    ],
  },
  {
    title: "معاملات",
    icon: <BriefcaseBusiness />,
    child: [
      {
        title: " پرداخت ها",
        url: "/customer/pay",
        icon: <BanknoteArrowUp />,
      },
      {
        title: "در یافتی ها",
        url: "/customer/receive",
        icon: <BanknoteArrowDown />,
      },
      {
        title: "انتقال پول ",
        url: "/customer/transfer",
        icon: <ArrowLeftRight />,
      },
    ],
  },
  {
    title: "گزارشات مختصر",
    url: "/customer/abridgedReportage",
    icon: <BookUp />,
  },
  {
    title: "گزارشات مفصل ",
    url: "/customer/executtiveReportage",
    icon: <BookUp2 />,
  },
];

export async function AppSidebar() {
  return (
    <Sidebar>
      <AppSidebarContent list={list} />
    </Sidebar>
  );
}
