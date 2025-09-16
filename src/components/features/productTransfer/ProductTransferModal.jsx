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
import createcostAction, { updateCostAction } from "@/actions/costAction";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { SwitchDemo } from "@/components/myUI/Switch";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";
import { createProductTransferAction } from "@/actions/productTransferAction";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),
  product: z.string({ required_error: " ذکر نام محصول الزامی است" }),
  count: z.number({ required_error: " ذکر تعداد محصول الزامی است" }),
  from: z.string({ required_error: " ذکر نام گدام منبع الزامی است" }),
  to: z.string({ required_error: " ذکر نام گدامی مقصدالزامی است" }),
  details: z.string().optional(),
});

export function ProductTransferModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [dateType, setDateType] = useState(false);
  const [filter, setfilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(schema),
  });

  function submiteForm(newData) {
    if (newData.from === newData.to) {
      toast.warning("برای انتقال دو گدام متفاوت انتخاب کنید.");
      return null;
    }
    if (product?.split("_")[0].split(")")[1] < Number(count)) return null;
    const myNewData = {
      ...newData,
      image: newData.image?.[0],
      product: newData.product.split("_")[1].split("-")[0],
      from: newData.from.split("_")[1],
      to: newData.to.split("_")[1],
      unit: product.split("_")[1].split("-")[3].split(",")[0],
    };
    console.log();
    startTransition(async () => {
      if (type === "create") {
        const result = await createProductTransferAction(myNewData);
        if (result.result?.message)
          return toast.warning(result.result?.message);
        if (!result.err) {
          toast.success("انتقال شما با موفقیت ثبت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ثبت انتقال شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }
  const from = form.watch("from");
  const product = form.watch("product");
  const count = form.watch("count");
  useEffect(() => {
    if (from !== "") setfilter(from?.split("_")[1]);
    if (
      product !== "" &&
      product?.split("_")[0].split(")")[1] < Number(count)
    ) {
      form.setError("count", {
        message: "تعداد انتقال باید مساوی یا کمتر از تعداد موجود باشد",
      });
    } else {
      form.clearErrors("count");
    }
  }, [from, product, count]);

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " انتقال جدید "}
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
            </div>

            <div className=" flex flex-row gap-4">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>از</FormLabel>
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

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>به</FormLabel>
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
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="product"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> محصول</FormLabel>
                    <AutoCompleteV2
                      value={field.value}
                      onChange={field.onChange}
                      dataType="items"
                      filter={filter}
                      label="محصول  را انتخاب کنید.."
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
