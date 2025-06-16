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
import { toast } from "sonner";
import createExternalProceedAction, {
  updateExternalProceedAction,
} from "@/actions/externalProceedAction";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی است" }),
  externalProceedTitle: z.string().min(1, " ذکر عنوان عاید الزامی است"),
  amount: z
    .number({ invalid_type_error: "ذکر مقدار پول الزامی می باشد" })
    .min(1, " مقدار پول نمیتواند کمتر از 1 باشد"),
  details: z.string().optional(),
});

export function ExternalProceedModal({
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
          }
        : {},
  });
  function submiteForm(newData) {
    startTransition(async () => {
      if (type === "create") {
        const result = await createExternalProceedAction(newData);
        if (!result.err) {
          toast.success("عواید شما با موفقیت ثبت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ثبت عواید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const currentData = data;
        const result = await updateExternalProceedAction(currentData, newData);
        if (!result.err) {
          toast.success("عواید شما با موفقیت آپدیت شد");
          onOpen(false);
          form.reset();
        } else {
          toast.error(
            "در آپدیت عواید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent className="xs:max-w-[300px] lg:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className={"text-right"}>
            {type == "update" ? "تصحیح" : " عواید جدید "}
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
            <div className="flex flex-row flex-wrap justify-between gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> تاریخ</FormLabel>
                    <DatePickerWithPresets
                      date={field.value}
                      onDate={field.onChange}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="externalProceedTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>عنوان عاید</FormLabel>
                    <Input
                      className={"w-[270px]"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row flex-wrap ">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>مقدار پول</FormLabel>
                    <Input
                      type={"number"}
                      className={"w-[270px]"}
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
