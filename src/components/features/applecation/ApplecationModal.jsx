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
import { useEffect, useRef, useTransition } from "react";
import { toast } from "sonner";

import { Loader2Icon } from "lucide-react";

import { useReactToPrint } from "react-to-print";

import moment from "moment-jalaali";

import { Label } from "@/components/ui/label";
import { SelectInput } from "@/components/myUI/select";
import { updateApplecationAction } from "@/actions/applecationAction";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";

const schema = z
  .object({
    status: z.enum(["reject", "approved"]),
    income: z
      .string({ required_error: "دریافت کننده الزامی میباشد" })
      .optional(),
    cent: z
      .number({ invalid_type_error: "فیصدی الزامی می باشد" })
      .min(0, "فیصدی نمیتواند کمتر از 0 باشد")
      .max(100, "فیصدی نمیتواند بیشتر از 100 باشد")
      .default(0)
      .optional(),

    metuAmount: z
      .number({ invalid_type_error: "مقدار میتیو الزامی می باشد" })
      .min(0, "مقدار پول الزامی است"),
    details: z.string().optional(),
  })
  .refine(
    (data) =>
      data.status !== "approved" || // اگر status != approved
      (data.status === "approved" && data.cent > 0),
    // یا اگر approved است و مقدار دارد
    {
      message: "در حالت تایید شده فیصدی الزامی است",
      path: ["cent"], // مسیر خطا را به فیلد مورد نظر مرتبط می‌کند
    }
  )
  .refine(
    (data) =>
      data.status !== "approved" || // اگر status != approved
      (data.status === "approved" && data.income !== undefined), // یا اگر approved است و مقدار دارد
    {
      message: "در حالت تایید شده، دریافت کننده الزامی است",
      path: ["income"], // مسیر خطا را به فیلد مورد نظر مرتبط می‌کند
    }
  );

export function ApplecationModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [isPending, startTransition] = useTransition();
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const form = useForm({
    resolver: zodResolver(schema),
  });

  async function submiteForm(newData) {
    const myNewData = {
      ...data,
      ...newData,
      income: newData.income?.split("_")?.[1] || "",
      date: new Date(),
    };
    startTransition(async () => {
      const result = await updateApplecationAction(myNewData);
      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.err) {
        toast.success(" نظر شما در مورد درخاست مشتری با موفقیت  ثبت شد ");
        handlePrint();

        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در ثبت نظر شما در مورد درخاست مشتری مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }

  const imgRef = useRef(null);

  const cent = form.watch("cent") || 0;
  const status = form.watch("status") || 0;

  useEffect(() => {
    if (status === "reject") {
      form.setValue("cent", 0, { shouldValidate: true });
    }
    if (status === "approved") {
      form.setValue("cent", "");
    }
  }, [status]);

  useEffect(() => {
    const total = data.totalAmount || 0;
    const metuAmount =
      Math.round((total + (total / 100) * Number(cent)) * 100) / 100;
    form.setValue("metuAmount", metuAmount, { shouldValidate: false });
  }, [cent]);

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            درخاست خرید {data?.buyer?.name}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
        </DialogHeader>
        {/* <OrderReceipt ref={contentRef} data={form.getValues()} /> */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4">
            <div className={"flex-1 space-y-2"}>
              <Label> تاریخ</Label>
              <Input
                type="text"
                disabled
                value={moment(data?.date).format("jYYYY/jMM/jDD")}
              />
            </div>

            <div className={"flex-1 space-y-2"}>
              <Label>مقدار رسید </Label>
              <Input type={"number"} disabled value={data.cashAmount} />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <div className={"flex-1 space-y-2"}>
              <Label>مقدار باقی</Label>
              <Input type={"number"} disabled value={data.lendAmount} />
            </div>

            <div className={"flex-1 space-y-2"}>
              <Label>مجموع پول</Label>
              <Input
                disabled
                type={"number"}
                className={"w-full"}
                value={data.totalAmount}
              />
            </div>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full space-y-6"
          >
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>تصمیم </FormLabel>
                    <SelectInput
                      type={"number"}
                      field={field}
                      fullwidth={true}
                      className={"flex-1"}
                      lable={"تصمیم"}
                      lable2={"تصمیم خود را در مورد درخاست مشتری بیان دارید"}
                      options={[
                        {
                          value: "approved",
                          label: "قبول",
                        },
                        {
                          value: "reject",
                          label: "رد کردن",
                        },
                      ]}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {status === "approved" && (
              <>
                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="income"
                    render={({ field }) => (
                      <FormItem className={"flex-1"}>
                        <FormLabel>دریافت گننده</FormLabel>
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
                <div className="flex flex-row gap-4">
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
                  <FormField
                    control={form.control}
                    name="metuAmount"
                    render={({ field }) => (
                      <FormItem className={"flex-1"}>
                        <FormLabel>مقدار METU</FormLabel>
                        <Input
                          type={"number"}
                          value={field.value}
                          disabled={true}
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
              </>
            )}
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفصیلات</FormLabel>
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
