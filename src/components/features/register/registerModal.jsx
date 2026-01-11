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
import { SelectInput } from "@/components/myUI/select";
import createAccountAction, {
  updateAccountAction,
} from "@/actions/accountAction";
import { toast } from "sonner";
import { CardTitle } from "@/components/ui/card";
import { useState, useTransition } from "react";
import { SwitchDemo } from "@/components/myUI/Switch";
import { Loader2Icon } from "lucide-react";
import { cleanSymbols } from "@/lib/utils";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),
  name: z.string({ required_error: '" ذکر نام فروشنده الزامی است "' }),
  accountType: z.enum(["buyer", "saller", "bank", "employe"]),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  details: z.string().optional(),
  initBalance: z.number().min(0).optional(),
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
  initBalanceType: z.enum(["lend", "borrow"]),
});

const accountTypeOptions = [
  {
    value: "saller",
    label: "فروشنده",
  },
  {
    value: "buyer",
    label: "خریدار",
  },
  {
    value: "bank",
    label: "بانک / صرافی",
  },
  {
    value: "employe",
    label: "کارمند",
  },
];

export function RegisterModal({
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
          }
        : {
            initBalanceType: "lend",
          },
  });

  async function submiteForm(formData) {
    const newFormData = {
      ...formData,
      name: cleanSymbols(formData.name),
      lend: formData.initBalanceType === "lend" ? formData.initBalance : 0,
      borrow: formData.initBalanceType === "borrow" ? formData.initBalance : 0,
      _id: data._id,
      image: formData.image?.[0],
    };
    startTransition(async () => {
      if (type === "create") {
        const result = await createAccountAction(newFormData);
        if (!result.err) {
          toast.success("حساب شما با موفقیت ایجاد شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ایجاد حساب شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const result = await updateAccountAction({
          data: newFormData,
          oldData: data,
        });

        if (!result.err) {
          toast.success("حساب شما با موفقیت آپدیت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در آپدیت حساب شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className=" lg:w-[600px]">
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " حساب جدید "}
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
            className=" space-y-6"
          >
            <div className="flex flex-row gap-4 flex-1 ">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className={" flex-1"}>
                    <FormLabel> تاریخ</FormLabel>
                    <DatePickerWithPresets
                      date={field.value}
                      onDate={field.onChange}
                      className="w-[100%] "
                      size="sm"
                      type={dateType ? "gregorian" : "jalali"}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>اسم</FormLabel>
                    <Input
                      className={""}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4 ">
              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>نوع حساب</FormLabel>
                    <SelectInput
                      disabled={type === "update"}
                      field={field}
                      fullwidth
                      options={accountTypeOptions}
                      lable={"نوع حساب"}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                type="number"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>شماره تماس</FormLabel>
                    <Input
                      className={"flex-1 w-auto"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4 ">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> آدرس</FormLabel>
                    <Input value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> ایمیل آدرس </FormLabel>
                    <Input
                      type={"email"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4 ">
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
                <FormItem className={"flex-1"}>
                  <FormLabel> تفصیلات</FormLabel>
                  <Textarea value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="dark:bg-[#003f3c] bg-[#008f88] rounded-lg shadow-lg p-3 shadow-[#000000c2] dark:shadow-[#1f1f1f] space-y-5">
              <CardTitle className={"font-extrabold"}>
                رسید حسابات سابقه
              </CardTitle>
              <div className="flex flex-row gap-4 ">
                <FormField
                  control={form.control}
                  name="initBalance"
                  render={({ field }) => (
                    <FormItem className={"flex-1"}>
                      <FormLabel> مبلغ</FormLabel>
                      <Input
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
                {form.watch("initBalance") > 0 && (
                  <FormField
                    control={form.control}
                    name="initBalanceType"
                    render={({ field }) => (
                      <FormItem className={"flex-1"}>
                        <FormLabel> نوعیت حساب</FormLabel>
                        <SelectInput
                          disabled={type !== "create" && data.initBalance > 0}
                          field={field}
                          fullwidth
                          lable={"نوعیت"}
                          options={[
                            { value: "lend", label: "از ما قرضدار است" },
                            {
                              value: "borrow",
                              label: "ما از او قرضدار استیم",
                            },
                          ]}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

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
