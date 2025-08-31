import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebarContent } from "./SideBarContent";
import { getAllSallerAndBuyer } from "@/services/accountService";

const list = [
  {
    title: "صفحه اصلی",
    url: "/vendee/home",
    icon: <img src="../house.png" className="size-7" />,
  },
  {
    title: "صورت حساب ها",
    url: "/vendee/account",
    icon: <img src="../man.png" className="size-7" />,
  },
  {
    title: "لیجر میتیو",
    url: "/vendee/metuLedgar",
    icon: <img src="../ledger.png" className="size-7" />,
  },
  {
    title: "لیجر",
    url: "/vendee/ledgar",
    icon: <img src="../ledger.png" className="size-7" />,
  },
  {
    title: "درخاستی",
    url: "/vendee/applecation",
    icon: <img src="../online-registration.png" className="size-7" />,
  },
  {
    title: "خرید",
    url: "/vendee/buy",
    icon: <img src="../discount.png" className="size-7" />,
  },
  {
    title: "فروش",
    url: "/vendee/sale",
    icon: <img src="../ewallet.png" className="size-7" />,
  },
  {
    title: "مصارف",
    url: "/vendee/cost",
    icon: <img src="../calculate-cost.png" className="size-7" />,
  },
  {
    title: "عواید بیرونی",
    url: "/vendee/externalProceed",
    icon: <img src="../money-bag.png" className="size-7" />,
  },
  {
    title: "معاملات",
    icon: <img src="../transaction-success.png" className="size-7" />,
    child: [
      {
        title: " پرداخت ها",
        url: "/vendee/pay",
        icon: <img src="../payment.png" className="size-7" />,
      },
      {
        title: "در یافتی ها",
        url: "/vendee/receive",
        icon: <img src="../money.png" className="size-7" />,
      },
    ],
  },
  {
    title: "گزارشات مختصر",
    url: "/vendee/abridgedReportage",
    icon: <img src="../documentation.png" className="size-7" />,
  },
  {
    title: "گزارشات مفصل ",
    url: "/vendee/executtiveReportage",
    icon: <img src="../folder.png" className="size-7" />,
  },
];

export async function VendeeAppSidebar() {
  return (
    <Sidebar>
      <AppSidebarContent list={list} />
    </Sidebar>
  );
}
