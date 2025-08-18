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
import { useEffect, useState, useTransition } from "react";
import CreateBuyAction, { updateBuyAction } from "@/actions/buyAction";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { SwitchDemo } from "@/components/myUI/Switch";

import { AutoCompleteV2 } from "@/components/myUI/ComboBox";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),
  income: z.string({ required_error: "پرداخت کننده الزامی میباشد" }),
  saller: z.string({ required_error: "نام فروشنده الزامی می‌باشد" }),
  cashAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
  borrowAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
  totalAmount: z
    .number({ invalid_type_error: "مجموع پول الزامی می باشد" })
    .min(0),
  cent: z
    .number({ invalid_type_error: "فیصدی الزامی می باشد" })
    .min(0, "فیصدی نمیتواند کمتر از 0 باشد")
    .max(100, "فیصدی نمیتواند بیشتر از 100 باشد"),
  metuAmount: z
    .number({ invalid_type_error: "مقدار METU الزامی می باشد" })
    .min(0),
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
  const [countByCash, setCountByCash] = useState(true);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "update"
        ? {
            ...data,
            date: new Date(data.date),
            saller: data.saller.name + "_" + data.saller._id,
            income: data.income.name + "_" + data.income._id,
          }
        : {},
  });
  function submiteForm(newData) {
    const myNewData = {
      ...newData,
      saller: newData.saller.split("_")[1],
      income: newData.income.split("_")[1],
      image: newData.image?.[0] || "",
    };

    startTransition(async () => {
      if (type === "create") {
        const result = await CreateBuyAction(myNewData);

        if (result?.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("خرید شما با موفقیت ثبت شد");
          onOpen(false);
          form.reset();
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
        };

        const result = await updateBuyAction(currentData, myNewData);

        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("خرید شما با موفقیت آپدیت شد");
          onOpen(false);
          form.reset();
        } else {
          toast.error(
            "در آپدیت خرید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }

  const cash = form.watch("cashAmount") || 0;
  const loan = form.watch("borrowAmount") || 0;
  const cent = form.watch("cent") || 0;
  const metuAmount = form.watch("metuAmount") || 0;
  useEffect(() => {
    if (countByCash) {
      const total = cash + loan;
      const metuAmount =
        Math.round((total + (total / 100) * Number(cent)) * 100) / 100;
      form.setValue("totalAmount", total, { shouldValidate: false });
      form.setValue("metuAmount", metuAmount, {
        shouldValidate: false,
      });
    } else {
      const totalAmount =
        Math.round(((100 * metuAmount) / (Number(cent) + 100)) * 100) / 100;
      form.setValue("totalAmount", totalAmount, { shouldValidate: false });
      form.setValue("cashAmount", totalAmount, { shouldValidate: false });
      form.resetField("borrowAmount", { defaultValue: 0 });
    }
  }, [cash, loan, cent, metuAmount]);

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
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
            <SwitchDemo
              value={countByCash}
              onChange={setCountByCash}
              label={"محاسبه بر اساس پول "}
            />
          </div>
        </DialogHeader>

        <Form key={JSON.stringify(data)} {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>پرداخت گننده</FormLabel>
                      <AutoCompleteV2
                        disabled={type === "update"}
                        value={field.value}
                        onChange={field.onChange}
                        type="company-bank"
                        label="پرداخت کننده را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className=" flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="cashAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار رسید </FormLabel>
                      <Input
                        type={"number"}
                        disabled={!countByCash}
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
                  control={form.control}
                  name="borrowAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار باقی</FormLabel>
                      <Input
                        type={"number"}
                        disabled={!countByCash}
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
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مجموع پول</FormLabel>
                      <Input
                        disabled
                        type={"number"}
                        className={"w-full"}
                        value={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cent"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> فیصدی</FormLabel>
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
                  control={form.control}
                  name="metuAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار METU</FormLabel>
                      <Input
                        type={"number"}
                        value={field.value}
                        disabled={countByCash}
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
                  control={form.control}
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
            </div>
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> تفصیلات</FormLabel>
                  <Textarea
                    className={"w-auto max-h-[200px]"}
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2.5">
              <DialogClose asChild>
                <Button
                  onClick={() => form.reset()}
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
