import { AutoComplete } from "@/components/myUI/AutoComplete";
import { DatePickerWithPresets } from "@/components/myUI/datePacker";
import { SelectInput } from "@/components/myUI/select";
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
import createcostAction, { updateCostAction } from "@/actions/costAction";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { SwitchDemo } from "@/components/myUI/Switch";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),
  costTital: z.string({ required_error: " ذکر عنوان مصرف الزامی است" }),
  income: z.string({ required_error: "پرداخت کننده الزامی میباشد" }),
  amount: z
    .number({ invalid_type_error: "ذکر مقدار پول الزامی می باشد" })
    .min(1, " مقدار پول نمیتواند کمتر از 1 باشد"),
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

export function CostModal({
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
            income: data.income.name + "_" + data.income._id,
            costTital: data.costTital.name + "_" + data.costTital._id,
          }
        : {},
  });

  function submiteForm(newData) {
    const myNewData = {
      ...newData,
      image: newData.image?.[0],
      income: newData.income.split("_")[1],
      costTital: newData.costTital.split("_")[1],
      createBy: "cost",
    };
    startTransition(async () => {
      if (type === "create") {
        const result = await createcostAction(myNewData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("مصارف شما با موفقیت ثبت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ثبت مصارف شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const currentData = {
          ...data,
          income: data.income._id,
          costTital: data.costTital._id,
        };
        const result = await updateCostAction(currentData, myNewData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("مصارف شما با موفقیت آپدیت شد");
          onOpen(false);
          form.reset();
        } else {
          toast.error(
            "در آپدیت مصارف شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " مصرف جدید "}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
          <div>
            <SwitchDemo
              value={dateType}
              onChange={setDateType}
              label={"تاریخ میلادی"}
            />
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className=" flex flex-row gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> تاریخ</FormLabel>
                    <DatePickerWithPresets
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
                name="costTital"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>عنوان مصرف</FormLabel>
                    <AutoCompleteV2
                      value={field.value}
                      onChange={field.onChange}
                      dataType="cost"
                      label="عنوان را انتخاب کنید.."
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
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>مقدار پول</FormLabel>
                    <Input
                      type={"number"}
                      className={" flex-1"}
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
