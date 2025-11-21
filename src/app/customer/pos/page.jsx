"use client";
import createSaleAction, { getAllPOSItemsAction } from "@/actions/saleAction";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  formatNumber,
  handlePrintPOS,
  handlePrintReceipt,
} from "@/lib/utils";
import Fuse from "fuse.js";
import { Loader2Icon, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
// const posData = [
//   {
//     _id: Math.random(),
//     badgeNumber: "dsfasfasfas",
//     product: "ali",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },

//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
//   {
//     _id: Math.random(),
//     badgeNumber: "jfhahksirds",
//     product: " Mohammad Fayeq Aqib Mohammad",
//     image: "/money-depot.png",
//     saleAmount: 55000,
//     quantity: 234,
//     unit: "کارتن",
//     barCode: "DL34SU73",
//   },
// ];
const Page = () => {
  const [data, setData] = useState([]);
  const [cart, setCart] = useState([]);
  const [cent, setCent] = useState(0);
  const [cashAmount, setCashAmount] = useState("");
  const [buyer, setBuyer] = useState("");
  const [revaleDate, setRevaleDate] = useState(false);
  const [search, setSearch] = useState("");
  const [barCode, setBarCode] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isPending2, startTransition2] = useTransition();
  const fuse = new Fuse(data, {
    keys: ["badgeNumber", "product.name"],
    threshold: 0.3,
  });

  const results = search ? fuse.search(search).map((res) => res.item) : data;

  useEffect(() => {
    startTransition(async () => {
      const result = await getAllPOSItemsAction();
      setData(result?.result || []);
    });
  }, [revaleDate]);

  function handleAddItemToCart(item) {
    setCart((cart) => [{ ...item, count: 1 }, ...cart]);
  }

  function handleRemoveitemFromCart(_id) {
    setCart((cart) => cart.filter((item) => item._id !== _id));
  }

  function handleAddQuantity(_id) {
    setCart((cart) =>
      cart.map((item) =>
        item._id === _id ? { ...item, count: item.count + 1 } : item
      )
    );

    // setData((data) => {
    //   return (
    //     data
    //       .map((item) => {
    //         if (item._id === _id) {
    //           // Prevent negative counts
    //           return { ...item, quantity: Math.max(item.quantity - 1, 0) };
    //         }
    //         return item;
    //       })
    //       // Optionally filter out items with count 0
    //       .filter((item) => item.quantity > 0)
    //   );
    // });
  }

  function handleMinusQuantity(_id) {
    setCart((cart) => {
      return (
        cart
          .map((item) => {
            if (item._id === _id) {
              // Prevent negative counts
              return { ...item, count: Math.max(item.count - 1, 0) };
            }
            return item;
          })
          // Optionally filter out items with count 0
          .filter((item) => item.count > 0)
      );
    });
  }

  function getQunatity(_id) {
    return cart?.find((item) => item._id === _id)?.count;
  }

  function handleChangeInput(value, _id) {
    const parsedValue = Math.max(Number(value), 0); // جلوگیری از منفی شدن
    if (!parsedValue) return;
    setCart((cart) =>
      cart.map((item) =>
        item._id === _id ? { ...item, count: parsedValue } : item
      )
    );
    // setCart((cart) =>
    //   cart.map((item) =>
    //     item._id === _id ? { ...item, count: parsedValue } : item
    //   )
    // );
  }

  function handleSubmitBarCode(e) {
    e.preventDefault();
    const product = data.find((item) => item.badgeNumber === barCode);
    if (product) {
      setCart((prev) => {
        const exists = prev.find(
          (item) => item.badgeNumber === product.badgeNumber
        );
        if (exists) {
          return prev.map((item) =>
            item._id === product._id ? { ...item, count: item.count + 1 } : item
          );
        }
        return [...prev, { ...product, count: 1 }];
      });
    } else {
      toast.error("محصول با این مشخصات وجود ندارد.");
    }
    setBarCode("");
  }

  const totalCount = cart?.reduce((acc, item) => item.count + acc, 0);
  const totalAmount = cart.reduce(
    (acc, item) => item?.saleAmount * item?.count + acc,
    0
  );

  const totalAveAmount = cart?.reduce(
    (acc, item) => item.aveUnitAmount + acc,
    0
  );
  const discount = (totalAmount * cent) / 100;

  function handlePay(bill = false) {
    if (!cart.length) {
      return toast.error(" لطفا با افزودن یک آیتم به بل مشتری آغاز کنید!");
    }
    startTransition2(async () => {
      const result = await createSaleAction({
        items: cart.map((item) => {
          return {
            ...item,
            discount: cent,
            amountBeforDiscount: item.saleAmount * item.count,
            profit:
              item.saleAmount -
              (item.saleAmount * cent) / 100 -
              item.aveUnitAmount,
          };
        }),
        totalAmount: totalAmount - discount,
        totalAmountBeforDiscount: totalAmount,
        totalCount,
        cashAmount: cashAmount || 0,
        totalProfit: totalAmount - discount - totalAveAmount,
        income: "68426436f40989bb6a60bf55",
        lendAmount: totalAmount - discount - cashAmount || 0,
        buyer: buyer.split("_")[1] || "691c06c3580b7f2182cc4e66",
      });

      if (!result.err) {
        toast.success(" فروش شما با موفقیت ثبت شد.");
        if (bill) handlePrintPOS(result?.result?._id);
        setCart([]);
        setBuyer("");
        setCashAmount("");
        setRevaleDate((re) => !re);
      } else {
        toast.error(
          "در ثبت فروش شما مشکلی به وجود آمده لطفا بعدا دباره تلاش کنید."
        );
      }
    });
  }

  return (
    <div className="flex gap-3 h-[88vh] ">
      <Card className="w-[120mm] rounded-2xl h-full  hidden p-3  lg:flex lg:flex-col lg:justify-between ">
        <Table className={" text-xs"}>
          {cart.length === 0 && (
            <TableCaption className="w-full text-center p-2">
              با افزودن یک محصول آغاز کنید.{" "}
            </TableCaption>
          )}

          <TableBody>
            {cart.map((item, i) => (
              <TableRow key={i} className={"text-center"}>
                <TableCell className={""}>
                  <div className="flex flex-col gap-1 w-40 overflow-hidden  p-1 rounded-md ">
                    <span className="leading-none w-40 text-wrap">
                      {" "}
                      {item.product?.name || item.product}
                    </span>
                    <Separator className={"bg-chart-1"} />
                    <span>{item?.badgeNumber}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="bg-sidebar-accent p-1 rounded-xl">
                      {item.unit?.name || item.unit}
                    </span>
                    <span> {item?.count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="p-1 rounded-xl bg-chart-6">
                      {formatCurrency(item.saleAmount)}
                    </span>
                    <span className="p-1 rounded-xl bg-chart-1">
                      {formatCurrency(item.saleAmount * item.count)}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Button
                    onClick={() => handleRemoveitemFromCart(item._id)}
                    variant="ghost"
                  >
                    <Trash className="text-red-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="space-y-2">
          <div className="flex gap-2 text-sm">
            <Label className={"w-1/3 font-extrabold"}> فیصدی تخفیف : </Label>
            <Input
              className={"h-8"}
              placeholder="فیصدی تخفیف"
              type={"number"}
              value={cent}
              onChange={(e) =>
                setCent(Math.min(Math.max(Number(e.target.value), 0), 100))
              }
            />
          </div>
          <Card>
            <CardContent className={"space-y-2 text-sm"}>
              <CardTitle className={"flex justify-between"}>
                <span>تعداد :</span> <span>{formatNumber(totalCount)}</span>
              </CardTitle>
              <CardTitle className={"flex justify-between"}>
                <span>مجموع :</span> <span>{formatCurrency(totalAmount)}</span>
              </CardTitle>
              <CardTitle className={"flex justify-between"}>
                <span>تخفیف :</span> <span>{formatCurrency(discount)}</span>
              </CardTitle>
              <CardTitle className={"flex justify-between"}>
                <span>قابل پرداخت :</span>{" "}
                <span>{formatCurrency(totalAmount - discount)}</span>
              </CardTitle>
              <div className="flex gap-2 items-center justify-between">
                <AutoCompleteV2
                  className={"w-27 h-8"}
                  label="خریدار"
                  value={buyer}
                  onChange={setBuyer}
                  type={"buyer"}
                />
                <Input
                  className={"w-27 h-8"}
                  placeholder=" نقد"
                  type={"number"}
                  value={cashAmount}
                  onChange={(e) =>
                    setCashAmount(Math.max(Number(e.target.value), 0))
                  }
                />
                <CardTitle className={""}>
                  <span>باقی :</span>{" "}
                  <span>
                    {formatCurrency(totalAmount - discount - cashAmount || 0)}
                  </span>
                </CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  className={"flex-1"}
                  disabled={!cart.length}
                  onClick={() => handlePay(true)}
                >
                  {isPending2 ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "   پرداخت و چاپ بل "
                  )}
                </Button>
                <Button
                  variant={"outline"}
                  className={"shadow-lg shadow-black/80 hover:shadow-md"}
                  onClick={() => handlePay(false)}
                  disabled={!cart.length}
                >
                  {isPending2 ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    "پرداخت"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Card>
      <div className="w-full lg:w-[calc(100%-120mm)] space-y-2">
        <div className="flex gap-2 w-full">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={"rounded-2xl"}
            placeholder={"جستجو ......."}
          />
          <form onSubmit={handleSubmitBarCode}>
            <Input
              value={barCode}
              onChange={(e) => setBarCode(e.target.value)}
              className={"rounded-2xl"}
              placeholder={"بارکود"}
              autoFocus
            />
          </form>
        </div>
        {isPending ? (
          <div className="size-full h-[calc(100%-40px)] flex justify-center items-center">
            <Loader2Icon className="animate-spin" />
          </div>
        ) : (
          <Card
            className={
              " bg-my-card w-full shadow-2xl   rounded-2xl h-[calc(100%-40px)] grid 2xl:grid-cols-4 xl:grid-cols-3   lg:grid-cols-1 md:grid-cols-2 grid-cols-1 p-3 overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] z"
            }
          >
            {results.map((item, i) => {
              const exiset = getQunatity(item._id);

              return (
                <Card
                  key={i}
                  className={
                    "p-2   shadow-xl border-[1px] border-chart-1 border-dashed  hover:shadow-2xl hover:bg-sidebar-border transition-all duration-300 h-min"
                  }
                >
                  <div className="relative w-full h-[140px]  shadow-[2px_5px_20px_-1px_rgba(0,0,0,0.3)] rounded-md border-0 overflow-hidden  ">
                    <Image src={item?.product?.image} fill objectFit="cover" />
                  </div>
                  <CardContent className={"space-y-2 p-0"}>
                    <CardTitle className={"text-md "}>
                      {item?.product?.name}
                    </CardTitle>
                    <div className="flex justify-between">
                      <CardTitle className={"text-sm"}>
                        {formatCurrency(item.saleAmount)}{" "}
                      </CardTitle>
                      <CardTitle className={"text-sm"}>
                        {formatNumber(item.count)}{" "}
                        <span className="italic text-xs text-green-700 ms-1">
                          {item?.unit?.name}
                        </span>{" "}
                      </CardTitle>
                    </div>
                    <div className="flex justify-between items-center">
                      {!exiset ? (
                        <Button
                          className={"px-10"}
                          size={"sm"}
                          onClick={() => handleAddItemToCart(item)}
                        >
                          افزودن
                        </Button>
                      ) : (
                        <div className="flex gap-1">
                          <Button
                            size={"sm"}
                            onClick={() => handleAddQuantity(item._id)}
                          >
                            <Plus />
                          </Button>
                          <Input
                            className={"size-[33px] px-1 "}
                            value={exiset}
                            onChange={(e) =>
                              handleChangeInput(e.target.value, item._id)
                            }
                          />
                          <Button
                            size={"sm"}
                            onClick={() => handleMinusQuantity(item._id)}
                          >
                            <Minus />
                          </Button>
                        </div>
                      )}
                      <CardDescription>{item.badgeNumber}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
};

export default Page;
