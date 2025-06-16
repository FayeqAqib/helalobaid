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
import { toast } from "sonner";
import { createPayAction, updatePayAction } from "@/actions/payAction";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }),
  saller: z.string().min(1, "خریدار الزامی است"),
  amount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
  details: z.string().optional(),
});

export function PayModal({
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

  async function submiteForm(newData) {
    startTransition(async () => {
      if (type === "create") {
        const result = await createPayAction(newData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("پرداخت شما با موفقیت ثبت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ثبت پرداخت شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const currentData = data;
        const result = await updatePayAction(currentData, newData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("پرداخت شما با موفقیت آپدیت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در آپدیت پرداخت شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
    onOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className="xs:max-w-[350px] lg:max-w-[690px]">
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " پرداخت جدید "}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
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
                    <FormLabel>گیرنده</FormLabel>
                    <AutoComplete
                      size="sm"
                      field={field}
                      type="saller"
                      borrow={true}
                      label="گیرنده را انتخاب کنید.."
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
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
