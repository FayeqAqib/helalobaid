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
import { toast } from "sonner";
import createSaleAction, { updateSaleAction } from "@/actions/saleAction";
import { Loader2Icon } from "lucide-react";
import { SwitchDemo } from "@/components/myUI/Switch";

import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { ModalTable } from "./ModalTable";

import { handlePrintReceipt } from "@/lib/utils";

const schemaA = z.object({
  date: z
    .date({ required_error: "تاریخ الزامی میباشد" })
    .default(() => new Date()),
  income: z.string({ required_error: "دریافت کننده الزامی میباشد" }),
  buyer: z.string({ required_error: "نام خریدار الزامی می‌باشد" }),
  totalAmount: z
    .number({ invalid_type_error: "مجموع پول الزامی می باشد" })
    .min(1, { required_error: "مجموع پول الزامی می باشد" }),
  totalAmountBeforDiscount: z
    .number({ invalid_type_error: "مجموع پول الزامی می باشد" })
    .min(0, { required_error: "مجموع پول الزامی می باشد" }),
  cashAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول نقد صفر و یا بزرگتر از صفر باشد  ")
    .default(0),
  lendAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول باقی صفر و یا بزرگتر از صفر باشد  ")
    .default(0),
  totalProfit: z
    .number({ invalid_type_error: "سود الزامی می باشد" })
    .min(0, "مقدار مجموع سود  صفر و یا بزرگتر از صفر باشد"),
  details: z.string().optional(),
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
const schemaB = z.object({
  product: z.string({ required_error: "مشخص بودن جنس الزامی می‌باشد" }),
  count: z
    .number({ invalid_type_error: " تعداد جنس الزامی می باشد" })
    .min(1, "حد اقل یک دانه")
    .default(1),
  unit: z.string({ required_error: "مشخص بودن واحد جنس الزامی می‌باشد" }),
  aveUnitAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(1, "مقدار پول الزامی است"), // مثلاً آیدی اختیاری,
  saleAmount: z
    .number({ invalid_type_error: " قیمت فروش الزامی می باشد" })
    .min(1, "مقدار پول الزامی است"),
  discount: z
    .number()
    .min(0, "تخفیف باید بزرگ تر ای 0 باشد")
    .max(100, "تخفیف باید کوچک تر ای 100 باشد")
    .default(0),
  profit: z
    .number({ invalid_type_error: "سود الزامی می باشد" })
    .min(0, "مقدار سود  صفر و یا بزرگتر از صفر باشد"),
});

export function SaleModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [dateType, setDateType] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saleList, setSaleList] = useState([]);

  const formA = useForm({
    resolver: zodResolver(schemaA),
    defaultValues:
      type !== "create"
        ? {
            ...data,
            date: new Date(data.date),
            buyer: data.buyer?.name + "_" + data.buyer?._id,
            income: data.income.name + "_" + data.income._id,
          }
        : {},
  });
  const formB = useForm({
    resolver: zodResolver(schemaB),
  });

  ///////////////////////////////// DELETE ITEM FROM LIST ///////////////////////////////////
  function handleDeleteItem(uId) {
    setSaleList((prev) => prev.filter((item) => item.uId !== uId));
  }

  async function submiteForm(newData) {
    const newSaleList = saleList.map((item) => {
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
      buyer: newData.buyer.split("_")[1],
      income: newData.income.split("_")[1],
      image: newData.image?.[0],
      items: newSaleList,
    };

    startTransition(async () => {
      if (type === "create") {
        const result = await createSaleAction(myNewData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("فروش شما با موفقیت ثبت شد");
          handlePrintReceipt(result?.result?._id);
          formA.reset();
          setSaleList([]);
          onOpen(false);
        } else {
          toast.error(
            "در ثبت فروش شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const currentData = {
          ...data,
          buyer: data.buyer._id,
          income: data.income._id,
          items: data.items.map((item) => ({
            ...item,
            product: item.product._id,
            unit: item.unit._id,
            depot: item.depot._id,
          })),
        };
        const result = await updateSaleAction(currentData, myNewData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("فروش شما با موفقیت آپدیت شد");
          onOpen(false);
          formA.reset();
        } else {
          toast.error(
            "در آپدیت فروش شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }

  ////////////////////////////////// CALCULATE TOTAL FROM LIST ///////////////////////////////////

  const product = formB.watch("product") || "";
  const saleAmount = formB.watch("saleAmount") || 0;
  const count = formB.watch("count") || 0;
  const aveUnitAmount = formB.watch("aveUnitAmount") || 0;
  const cashAmount = formA.watch("cashAmount") || 0;
  const discount = formB.watch("discount") || 0;

  async function getProduct() {
    const _ids = product.split("_");
    const unit = _ids[0].split("(")[1].split(")")[0];
    const aveUnitAmount = _ids[1].split("-")[1];
    const saleAmount = product.split(",")?.[3]?.split("#")[0];
    formB.setValue("unit", unit, { shouldValidate: true });
    formB.setValue("aveUnitAmount", Math.round(aveUnitAmount * 10) / 10, {
      shouldValidate: true,
    });

    formB.setValue("saleAmount", Math.round(saleAmount * 10) / 10);
  }

  const { total, totalBeforDiscount, totalProfit } = useMemo(() => {
    const total = saleList.reduce(
      (acc, item) =>
        acc +
        (item.count * item.saleAmount -
          (item.count * item.saleAmount * item?.discount) / 100),
      0
    );

    const totalBeforDiscount = saleList.reduce(
      (acc, item) => acc + item.count * item.saleAmount,
      0
    );

    const totalProfit = saleList.reduce(
      (acc, item) =>
        acc +
        (item.count * item.saleAmount -
          (item.count * item.saleAmount * item?.discount) / 100) -
        item?.aveUnitAmount * item?.count,
      0
    );

    return { total, totalBeforDiscount, totalProfit };
  }, [saleList]);

  useEffect(() => {
    formA.setValue("totalAmountBeforDiscount", totalBeforDiscount, {
      shouldValidate: true,
    });
    formA.setValue("totalAmount", total, {
      shouldValidate: true,
    });
    formA.setValue("totalProfit", totalProfit, {
      shouldValidate: true,
    });

    if (saleAmount > 0 && count > 0 && aveUnitAmount > 0) {
      const pro = saleAmount * count;
      const myProfit =
        Math.round(
          (pro - (pro * discount) / 100 - aveUnitAmount * count) * 10
        ) / 10;

      formB.setValue("profit", myProfit, { shouldValidate: true });
    }

    const lend = total - cashAmount;
    formA.setValue("lendAmount", lend, { shouldValidate: true });
  }, [
    total,
    cashAmount,
    aveUnitAmount,
    saleAmount,
    product,
    discount,
    count,
    saleList.length,
  ]);

  useEffect(() => {
    if (product) {
      getProduct();
      if (count > Number(product.split("_")[0].split(")")[1])) {
        formB.setError("count", {
          message: "تعداد فروش از تعداد موجود بیشتر بوده نمی تواند",
        });
      } else {
        formB.clearErrors("count");
      }
    }
  }, [product]);

  useEffect(() => {
    if (type !== "create") {
      const myData = data.items?.map((item) => {
        return {
          ...item,
          product: {
            name: item.product?.name,
            _id: item.product._id,
          },
          unit: { name: item.unit.name, _id: item.unit._id },
          depot: {
            name: item.depot?.name,
            _id: item.depot?._id,
          },
          id: item._id,
          uId: item.id + Math.random().toString(),
        };
      });

      setSaleList(myData);
    }
  }, []);

  /////////////////////////////// ADD TO LIST ///////////////////////////////////

  function handleAddToList(data) {
    const name = data.product?.split("_")?.[0].split("-")?.[0];
    const brand = data.product?.split("_")?.[0]?.split("-")?.[1];
    const companyName = data.product
      ?.split("_")[0]
      ?.split("-")[2]
      ?.split("(")[0];

    const pro = data.product.split("_")[1].split("-");
    const myData = {
      ...data,
      amountBeforDiscount:
        data.saleAmount * data.count -
        (data.saleAmount * data.count * data?.discount) / 100,
      product: {
        name,
        brand,
        companyName,
        _id: pro[0],
      },
      depot: { name: pro[2].split(",")[1], _id: pro[2].split(",")[0] },
      unit: { name: pro[3].split(",")[1], _id: pro[3].split(",")[0] },
      id: product.split("#")[1],
      _id: product.split("#")[1],
      uId: product.split("#")[1] + Math.random().toString(),
    };
    setSaleList((prev) => [myData, ...prev]);
    formB.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent
        className={"overflow-auto max-h-[calc(100vh-70px)] md:max-w-6xl"}
      >
        {/* <ChoseItemsTable handleAddToList={handleAddToList} />; */}
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " فروش جدید "}
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
        {/* <OrderReceipt ref={contentRef} data={form.getValues()} /> */}
        <Form key={saleList.toString()} {...formB}>
          <form
            onSubmit={formB.handleSubmit(handleAddToList)}
            className="w-full "
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-4">
                <FormField
                  control={formB.control}
                  name="product"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>محصول</FormLabel>
                      <AutoCompleteV2
                        ompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        dataType="items"
                        label=" محصول را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={formB.control}
                  name="count"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>تعداد</FormLabel>
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
                  control={formB.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>واحد</FormLabel>
                      <Input
                        disabled
                        type={"text"}
                        value={field.value}
                        onChange={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={formB.control}
                  name="aveUnitAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>اوسط تمام شد</FormLabel>
                      <Input
                        disabled
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
                  control={formB.control}
                  name="saleAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> قیمت فروش</FormLabel>
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
                  name="discount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>تخفیف</FormLabel>
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
                  name="profit"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار مفاد</FormLabel>
                      <Input
                        type={"number"}
                        disabled
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

              <Button type="submit" className=" self-center   flex-1 h-full">
                افزودن
              </Button>
            </div>
          </form>
        </Form>
        <ModalTable data={saleList} onDelete={handleDeleteItem} />
        <Form key={open.toString()} {...formA}>
          <form
            onSubmit={formA.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-4">
                <FormField
                  control={formA.control}
                  name="totalAmountBeforDiscount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مجموع </FormLabel>
                      <Input
                        type={"number"}
                        disabled
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
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مجموع قابل پرداخت</FormLabel>
                      <Input
                        type={"number"}
                        disabled
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
                  name="totalProfit"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مجموع مفاد</FormLabel>
                      <Input
                        type={"number"}
                        disabled
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
              <div className="flex flex-row gap-4">
                <FormField
                  control={formA.control}
                  name="cashAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار نقد</FormLabel>
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
                  name="lendAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار باقی</FormLabel>
                      <Input
                        type={"number"}
                        disabled
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
              </div>
              <div className=" flex flex-row gap-4">
                <FormField
                  control={formA.control}
                  name="buyer"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>خریدار</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        type="buyer"
                        label="خریدار را انتخاب کنید.."
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
                      <FormLabel>دریافت گننده</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        type="company-bank"
                        label="دریافت کننده را انتخاب کنید.."
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
              <div className=" flex flex-row gap-4">
                <FormField
                  control={formA.control}
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
            </div>
            <div className="flex justify-end gap-2.5">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    formA.reset();
                    formB.reset();
                    setSaleList([]);
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
