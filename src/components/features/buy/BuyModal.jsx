import { AutoComplete } from "@/components/myUI/AutoComplete";
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
import { useEffect, useTransition } from "react";
import CreateBuyAction, { updateBuyAction } from "@/actions/buyAction";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }),
  saller: z.string().min(1, "فروشنده الزامی است"),
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
  details: z.string().optional(),
});

export function BuyModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      type === "update"
        ? {
            ...data,
            date: data.date,
            saller: data.saller._id,
          }
        : {},
  });
  function submiteForm(newData) {
    startTransition(async () => {
      if (type === "create") {
        const result = await CreateBuyAction(newData);

        if (result.result?.message)
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
        const currentData = data;

        const result = await updateBuyAction(currentData, newData);

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
  useEffect(() => {
    const total = Number(cash) + Number(loan);
    const metuAmount =
      Math.round((total + (total / 100) * Number(cent)) * 100) / 100;
    form.setValue("totalAmount", total, { shouldValidate: true });
    form.setValue("metuAmount", metuAmount, { shouldValidate: true });
  }, [cash, loan, cent]);

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className="xs:max-w-[350px] lg:max-w-[690px]">
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " خرید جدید "}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
        </DialogHeader>

        <Form key={JSON.stringify(data)} {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className="flex flex-row flex-wrap justify-center gap-[22px] gap-y-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> تاریخ</FormLabel>
                    <DatePickerWithPresets
                      size="sm"
                      date={field.value}
                      onDate={field.onChange}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="saller"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>فروشنده</FormLabel>
                    <AutoComplete
                      size="sm"
                      field={field}
                      type="saller"
                      label="فروشنده را انتخاب کنید.."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cashAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مقدار رسید </FormLabel>
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
                name="borrowAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مقدار باقی</FormLabel>
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
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
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
                  <FormItem>
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
              <FormField
                control={form.control}
                name="metuAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مقدار METU</FormLabel>
                    <Input disabled type={"number"} value={field.value} />
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
              <Button type="submit">
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
