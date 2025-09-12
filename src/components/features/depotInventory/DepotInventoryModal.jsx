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
import createDepotItemsAction, {
  updateDepotItemsAction,
} from "@/actions/depotItemsAction";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),

  product: z.string({ required_error: "مشخص بودن جنس الزامی می‌باشد" }),
  count: z
    .number({ invalid_type_error: " تعداد جنس الزامی می باشد" })
    .min(1, "مقدار پول الزامی است")
    .default(1),
  unit: z.string({ required_error: "مشخص بودن واحد جنس الزامی می‌باشد" }),
  unitAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(1, "مقدار پول الزامی است"),
  aveUnitAmount: z
    .number({ invalid_type_error: "مقدار اوسط الزامی می باشد" })
    .min(0, "مقدار پول الزامی است"),
  transportCost: z.number().min(0, "مقدار پول الزامی است").default(0),
  depot: z.string({ required_error: "محل دپو الزامی می‌باشد" }),
  expirationDate: z.date().optional(),
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

export function DepotInventoryModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [dateType, setDateType] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "update"
        ? {
            ...data,
            date: new Date(data.date),
            product: data.product.name + "_" + data.product._id,
            unit: data.unit.name + "_" + data.unit._id,
            depot: data.depot.name + "_" + data.depot._id,
          }
        : {},
  });
  function submiteForm(newData) {
    const myNewData = {
      ...newData,
      product: newData.product.split("_")[1],
      unit: newData.unit.split("_")[1],
      depot: newData.depot.split("_")[1],
      image: newData.image?.[0] || "",
      createBy: "inventory",
    };

    startTransition(async () => {
      if (type === "create") {
        const result = await createDepotItemsAction(myNewData);

        if (result?.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("موجودی شما با موفقیت ثبت شد");
          onOpen(false);
          form.reset();
        } else {
          toast.error(
            "در ثبت موجودی شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }

      if (type === "update") {
        const result = await updateDepotItemsAction({
          ...myNewData,
          _id: data._id,
        });

        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("موجودی شما با موفقیت آپدیت شد");
          onOpen(false);
          form.reset();
        } else {
          toast.error(
            "در آپدیت موجودی شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }
  const count = form.watch("count") || 0;
  const unitAmount = form.watch("unitAmount") || 0;
  const transportCost = form.watch("transportCost") || 0;

  useEffect(() => {
    const ave = transportCost / count + unitAmount;
    form.setValue("aveUnitAmount", ave, { shouldValidate: true });
  }, [count, unitAmount, transportCost]);
  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " موجودی جدید "}
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
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>واحد</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        dataType="unit"
                        label="واحد را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="unitAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> قیمت فی واحد </FormLabel>
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
                  control={form.control}
                  name="aveUnitAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>اوسط قیمت </FormLabel>
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
              <div className=" flex flex-row gap-4">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
              <div className=" flex flex-row gap-4">
                <FormField
                  control={form.control}
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
