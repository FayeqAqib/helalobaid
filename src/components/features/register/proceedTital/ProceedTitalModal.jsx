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
import { SwitchDemo } from "@/components/myUI/Switch";
import { Loader2Icon } from "lucide-react";
import createProductAction, {
  updateProductAction,
} from "@/actions/productAction";
import createProceedTitalAction, {
  updateProceedTitalAction,
} from "@/actions/proceedTitalAction";

const schema = z.object({
  date: z.date({ required_error: "تاریخ الزامی میباشد" }).default(new Date()),
  name: z.string({ required_error: '" ذکر نام کتگوری عواید الزامی است "' }),
  details: z.string().optional(),
});

export function ProceedTitalModal({
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
        : {},
  });
  async function submiteForm(formData) {
    const newFormData = {
      ...formData,
      image: formData.image?.[0],
    };
    startTransition(async () => {
      if (type === "create") {
        const result = await createProceedTitalAction(newFormData);
        if (!result.err) {
          toast.success("کتگوری عواید شما با موفقیت ایجاد شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ایجاد کتگوری عواید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const result = await updateProceedTitalAction({
          ...newFormData,
          _id: data._id,
        });

        if (!result.err) {
          toast.success("کتگوری عواید شما با موفقیت آپدیت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در آپدیت کتگوری عواید شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
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
            {type == "update" ? "تصحیح" : " کتگوری عواید جدید "}
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
                    <FormLabel>اسم کتگوری </FormLabel>
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
