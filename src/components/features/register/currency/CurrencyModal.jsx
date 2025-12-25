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

import { useTransition } from "react";

import { Loader2Icon } from "lucide-react";

import { cleanSymbols } from "@/lib/utils";
import {
  createCurrencyAction,
  updateCurrencyAction,
} from "@/actions/currencyAction";
import { CardTitle } from "@/components/ui/card";

const schema = z.object({
  name: z.string({ required_error: '" ذکر نام محصول الزامی است "' }),
  code: z.string({ required_error: "ذکر کود واحد پولی الزامی است" }),
  rate: z.number({ required_error: "افزودن نسبت ارزشی پول الزامی میاشد." }),
});

export function CurrencyModal({
  children,
  data = {},
  type = "create",
  open,
  onOpen,
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: type === "update" ? data : {},
  });
  async function submiteForm(formData) {
    const newFormData = {
      name: cleanSymbols(formData.name),
      code: cleanSymbols(formData?.code),
      rate: formData?.rate,
    };
    startTransition(async () => {
      if (type === "create") {
        const result = await createCurrencyAction(newFormData);
        if (!result.err) {
          toast.success("واحد پولی شما با موفقیت ایجاد شد");

          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در ایجاد واحد پولی شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      }
      if (type === "update") {
        const result = await updateCurrencyAction({
          ...newFormData,
          _id: data._id,
        });

        if (!result.err) {
          toast.success("واحد پولی شما با موفقیت آپدیت شد");
          form.reset();
          onOpen(false);
        } else {
          toast.error(
            "در آپدیت واحد پولی شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
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
            {type == "update" ? "تصحیح" : " محصول جدید "}
          </DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
        </DialogHeader>
        {/* <CardTitle>
          لطفا برای استفاده از مولتی کرنسی سیستم خود ره آپ گرید کنید.
        </CardTitle> */}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className=" space-y-6"
          >
            <div className="flex flex-row gap-4 flex-1 ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> واحد پولی </FormLabel>
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
                name="code"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel>کود</FormLabel>
                    <Input
                      className={""}
                      value={field.value}
                      onChange={field.onChange}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rate"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <FormLabel> ارزش نسبی </FormLabel>
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
