import { DatePickerWithPresets } from "@/components/myUI/datePacker";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useTransition } from "react";
import CreateBuyAction, { updateBuyAction } from "@/actions/buyAction";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { SwitchDemo } from "@/components/myUI/Switch";

import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { ModalTable } from "./ModalTable";

const schemaA = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),
  saller: z.string({ required_error: "نام فروشنده الزامی می‌باشد" }),
  income: z.string({ required_error: "پرداخت کننده الزامی میباشد" }),
  totalAmount: z
    .number({ invalid_type_error: "مجموع پول الزامی می باشد" })
    .min(0),
  cashAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول  باقی کمتر از صفر بوده نمی تواند  ")
    .default(0),
  borrowAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
  transportCost: z.number().min(0, "مقدار پول الزامی است").default(0),

  image: z
    .any()
    .refine(
      (files) =>
        !files ||
        typeof files === "string" ||
        files[0]?.size <= 2.5 * 1024 * 1024,
      "حجم عکس نباید بیشتر از ۲.۵ مگابایت باشد"
    )
    .optional(),
});

////////////////////////////////////////////////////////////////////// ADD TO LIST SCHEMA ///////////////////////////////////
const schemaB = z.object({
  badgeNumber: z.string({ required_error: " بج نمبر الزامی می باشد" }),
  product: z.string({ required_error: "مشخص بودن جنس الزامی می‌باشد" }),
  unit: z.string({ required_error: "مشخص بودن واحد جنس الزامی می‌باشد" }),
  count: z
    .number({ invalid_type_error: " تعداد جنس الزامی می باشد" })
    .min(1, "یک یا بزرگتر  قابل قبول است"),
  unitAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول باید بزرگتر از صفر باشد است"),
  saleAmount: z.number().min(0, "مقدار پول الزامی است").optional(),
  depot: z.string({ required_error: "محل دپو الزامی می‌باشد" }),
  expirationDate: z.date().optional(),
  details: z.string().optional(),
});

export function BuyModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [dateType, setDateType] = useState(false);
  const [buyList, setBuyList] = useState([]);

  const [isPending, startTransition] = useTransition();
  const formA = useForm({
    resolver: zodResolver(schemaA),
    defaultValues:
      type !== "create"
        ? {
            ...data,
            date: new Date(data.date),
            saller: data.saller.name + "_" + data.saller._id,
            income: data.income.name + "_" + data.income._id,
          }
        : {},
  });
  const formB = useForm({
    resolver: zodResolver(schemaB),
  });
  /////////////////////////////// ADD TO LIST ///////////////////////////////////
  function handleAddToList(data) {
    const myData = {
      ...data,
      product: {
        name: data.product.split("_")[0],
        _id: data.product.split("_")[1],
      },
      unit: { name: data.unit.split("_")[0], _id: data.unit.split("_")[1] },
      depot: { name: data.depot.split("_")[0], _id: data.depot.split("_")[1] },
      id: Math.random().toString(36).substring(2, 9),
    };
    setBuyList((prev) => [...prev, myData]);
    formB.reset();
  }

  ///////////////////////////////// DELETE ITEM FROM LIST ///////////////////////////////////
  function handleDeleteItem(id) {
    setBuyList((prev) => prev.filter((item) => item.id !== id));
  }

  //////////////////////////////////// SUBMIT FINAL FORM //////////////////////////////////////
  function submiteForm(newData) {
    const buyLists = buyList.map((item) => {
      return {
        ...item,
        product: item.product._id,
        unit: item.unit._id,
        depot: item.depot._id,
        createBy: "buy",
      };
    });
    const myNewData = {
      ...newData,
      saller: newData.saller.split("_")[1],
      income: newData.income.split("_")[1],
      image: newData.image?.[0] || "",
      items: buyLists,
    };

    startTransition(async () => {
      if (type === "create") {
        const result = await CreateBuyAction(myNewData);

        if (result?.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("خرید شما با موفقیت ثبت شد");
          onOpen(false);
          formA.reset();
          setBuyList([]);
        } else {
          toast.error(
            "در ثبت خرید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }

      if (type === "update") {
        const currentData = {
          ...data,
          saller: data.saller._id,
          income: data.income._id,
          items: data.items.map((item) => ({
            ...item,
            product: item.product._id,
            unit: item.unit._id,
            depot: item.depot._id,
          })),
        };

        const result = await updateBuyAction(currentData, myNewData);

        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("خرید شما با موفقیت آپدیت شد");
          onOpen(false);
          formA.reset();
        } else {
          toast.error(
            "در آپدیت خرید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }

  /////////////////////////////// AUTO CALCULATION ///////////////////////////////////
  const totalAmount = formA.watch("totalAmount") || 0;
  // const finalPrice = formA.watch("finalPrice") || 0;
  const cashAmount = formA.watch("cashAmount") || 0;
  const transportCost = formA.watch("transportCost") || 0;

  ////////////////////////////////// CALCULATE TOTAL FROM LIST ///////////////////////////////////
  const total = useMemo(
    () => buyList.reduce((acc, item) => acc + item.count * item.unitAmount, 0),

    [buyList]
  );

  /////////////////////////////// USE EFFECTS ///////////////////////////////////
  useEffect(() => {
    if (buyList.length > 0) {
      formA.setValue("totalAmount", total, { shouldValidate: false });
    }
    if (totalAmount > 0 || cashAmount > 0) {
      const borrow = totalAmount - cashAmount;
      formA.setValue("borrowAmount", borrow, {
        shouldValidate: true,
      });
    }

    if (transportCost >= 0) {
      setBuyList((buyList) =>
        buyList.map((item) => {
          return {
            ...item,
            aveUnitAmount:
              (((item.unitAmount * 100) / total) * transportCost) / 100 +
              item.unitAmount,
          };
        })
      );
    }
  }, [totalAmount, cashAmount, transportCost, buyList.length]);

  useEffect(() => {
    if (type !== "create") {
      const myData = data.items?.map((item) => {
        return {
          ...item,
          product: {
            name: item?.product?.name,
            _id: item?.product?._id,
          },
          unit: { name: item?.unit?.name, _id: item?.unit?._id },
          depot: {
            name: item?.depot?.name,
            _id: item?.depot?._id,
          },
          id: item.id,
        };
      });
      setBuyList(myData);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent
        className={"overflow-auto max-h-[calc(100vh-80px)] md:max-w-6xl"}
      >
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " خرید جدید "}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
          <div className="flex justify-end gap-4">
            <SwitchDemo
              value={dateType}
              onChange={setDateType}
              label={"تاریخ میلادی"}
            />
          </div>
        </DialogHeader>

        <Form key={buyList.toString()} {...formB}>
          <form
            onSubmit={formB.handleSubmit(handleAddToList)}
            className="w-full "
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-4">
                <FormField
                  control={formB.control}
                  name="badgeNumber"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>بج نمبر</FormLabel>
                      <Input
                        type={"text"}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formB.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>محصول</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        dataType="product"
                        label=" محصول را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formB.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>واحد</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        dataType="unit"
                        label=" واحد را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  control={formB.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> تعداد </FormLabel>
                      <Input
                        type={"number"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" flex flex-row gap-4">
                <FormField
                  control={formB.control}
                  name="unitAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> قیمت خرید </FormLabel>
                      <Input
                        type={"number"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formB.control}
                  name="saleAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> قیمت فروش </FormLabel>
                      <Input
                        type={"number"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formB.control}
                  name="expirationDate"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> تاریخ انقضا</FormLabel>
                      <DatePickerWithPresets
                        size="sm"
                        defaultSelet={false}
                        date={field.value}
                        onDate={field.onChange}
                        type={dateType ? "gregorian" : "jalali"}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formB.control}
                  name="depot"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>گدام</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        dataType="depot"
                        label=" گدام را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className=" self-center mb-1  flex-1 w-full h-full"
              >
                افزودن
              </Button>
            </div>
          </form>
        </Form>
        <ModalTable data={buyList} onDelete={handleDeleteItem} />
        <Form key={open.toString()} {...formA}>
          <form onSubmit={formA.handleSubmit(submiteForm)} className="w-ful  ">
            <div className="flex flex-col gap-3 mb-3">
              <div className=" flex flex-row gap-4">
                <FormField
                  control={formA.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> تاریخ</FormLabel>
                      <DatePickerWithPresets
                        size="sm"
                        date={field.value}
                        onDate={field.onChange}
                        type={dateType ? "gregorian" : "jalali"}
                      />

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formA.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> مجموع قیمت </FormLabel>
                      <Input
                        disabled
                        type={"number"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formA.control}
                  name="cashAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار رسید </FormLabel>
                      <Input
                        type={"number"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formA.control}
                  name="borrowAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار باقی</FormLabel>
                      <Input
                        disabled
                        type={"number"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" flex flex-row gap-4">
                <FormField
                  control={formA.control}
                  name="transportCost"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> مصرف انتقال</FormLabel>
                      <Input
                        type={"number"}
                        className={"w-full"}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formA.control}
                  name="saller"
                  render={({ field }) => (
                    <FormItem className={"flex-1 mx-auto"}>
                      <FormLabel>فروشنده</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        type="saller"
                        label="فروشنده را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formA.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>پرداخت گننده</FormLabel>
                      <AutoCompleteV2
                        disabled={type === "update"}
                        value={field.value}
                        onChange={field.onChange}
                        dataType="customer"
                        type="company-bank"
                        label="پرداخت کننده را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={formA.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>عکس</FormLabel>
                      <Input
                        type={"file"}
                        disabled={type !== "create"}
                        onChange={(e) => field.onChange(e.target.files)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={formB.control}
                name="details"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> تفصیلات</FormLabel>
                    <Textarea
                      className={"w-auto max-h-[60px]"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    formA.reset();
                    formB.reset();
                    setBuyList([]);
                  }}
                  type="button"
                  variant={"outline"}
                >
                  انصراف
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2Icon className="animate-spin mr-2" />
                ) : (
                  " ذخیره کردن"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
