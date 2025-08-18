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
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";

import { SwitchDemo } from "@/components/myUI/Switch";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";

import { createTransferAction } from "@/actions/transferAction";

const schema = z.object({
  date: z
    .date({ required_error: "تاریخ الزامی میباشد" })
    .default(() => new Date()),
  from: z.string({ required_error: " الزامی میباشد" }),
  to: z.string({ required_error: " الزامی میباشد" }),
  amount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
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

export function TransferModal({
  children,

  open,
  onOpen,
}) {
  const [dateType, setDateType] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(schema),
  });

  async function submiteForm(newData) {
    const myNewData = {
      ...newData,
      from: newData.from.split("_")[1],
      to: newData.to.split("_")[1],
      image: newData.image?.[0],
    };
    startTransition(async () => {
      const result = await createTransferAction(myNewData);

      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.err) {
        toast.success("  انتقال پول با موفقیت ثبت شد ");
        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در ثبت انتقال پول مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}>انتقال جدید</DialogTitle>
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
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> از</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        type="bank-company"
                        label="پرداخت گننده را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> به</FormLabel>
                      <AutoCompleteV2
                        value={field.value}
                        onChange={field.onChange}
                        type="bank-company"
                        label="دریافت گننده را انتخاب کنید.."
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>مقدار پول </FormLabel>
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
                  name="image"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel>عکس</FormLabel>
                      <Input
                        type={"file"}
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
                <FormItem className={"flex-1"}>
                  <FormLabel> تفصیلات</FormLabel>
                  <Textarea
                    className={"w-auto "}
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
