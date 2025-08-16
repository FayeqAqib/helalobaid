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
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { Loader2Icon } from "lucide-react";
import { SwitchDemo } from "@/components/myUI/Switch";

import { useReactToPrint } from "react-to-print";
import createApplecationAction from "@/actions/applecationAction";

const schema = z.object({
  sendDate: z
    .date({ required_error: "تاریخ الزامی میباشد" })
    .default(() => new Date()),
  cashAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
  lendAmount: z
    .number({ invalid_type_error: "مقدار پول الزامی می باشد" })
    .min(0, "مقدار پول الزامی است")
    .default(0),
  totalAmount: z
    .number({ invalid_type_error: "مجموع پول الزامی می باشد" })
    .min(1, { required_error: "مجموع پول الزامی می باشد" }),
  image: z
    .any()
    .refine((file) => file?.length === 1, "یک عکس انتخاب کنید")
    .refine(
      (files) => !files || files[0]?.size <= 2.5 * 1024 * 1024,
      "حجم عکس نباید بیشتر از ۲.۵ مگابایت باشد"
    )
    .optional(),
  BuyerMessage: z.string().optional(),
});

export function ApplecationModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [dateType, setDateType] = useState(false);
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const form = useForm({
    resolver: zodResolver(schema),
  });

  async function submiteForm(newData) {
    const myNewData = {
      ...newData,
      image: newData.image?.[0],
    };
    startTransition(async () => {
      const result = await createApplecationAction(myNewData);
      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.err) {
        toast.success("درخاست شما با موفقیت ثبت شد");
        handlePrint();

        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در ثبت درخاست شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }

  const cash = form.watch("cashAmount") || 0;
  const loan = form.watch("lendAmount") || 0;

  useEffect(() => {
    const total = cash + loan;

    form.setValue("totalAmount", total, { shouldValidate: true });
  }, [cash, loan]);

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className="">
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

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-4">
                <FormField
                  control={form.control}
                  name="sendDate"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> تاریخ</FormLabel>
                      <DatePickerWithPresets
                        size="sm"
                        dataType={"vendee"}
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
                  name="cashAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
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
                  name="lendAmount"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
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
              </div>
              <div className="flex flex-row gap-4">
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
              name="BuyerMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>جذیات</FormLabel>
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
