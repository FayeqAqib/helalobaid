import { SelectInput } from "@/components/myUI/select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";

import { createUserAction } from "@/actions/user";
import { Label } from "@/components/ui/label";
import { AutoCompleteV2 } from "@/components/myUI/ComboBox";

const RoleEnum = z.enum(["admin", "employe"]);
const signupSchema = z
  .object({
    username: z.string().min(3, "حداقل 3 کاراکتر وارد کنید"),
    password: z.string().min(4, "حداقل 4 کاراکتر وارد کنید"),
    confirmPassword: z.string().min(4, "لطفا تایید رمز عبور را وارد کنید"),
    owner: z.string({ required_error: "نام فروشنده الزامی می‌باشد" }),
    role: RoleEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تایید آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export function UserModal({ children, data = {}, open, onOpen }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: data,
  });

  function submiteForm(myData) {
    const newData = { ...myData, owner: myData.owner?.split("_")?.[1] };

    startTransition(async () => {
      const result = await createUserAction(newData);
      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.err) {
        toast.success("حساب کاربری با موفقیت ثبت شد");
        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در ایجاد حساب کاربری شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}>ایجاد کاربر جدید</DialogTitle>
          <DialogDescription className={"text-right"}>
            لطف نموده در درج اطلاعات دقت نمایید.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submiteForm)}
            className="w-full  rounded-lg shadow-md p-8 space-y-6"
          >
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <Label>نام کاربری</Label>

                    <Input
                      placeholder="نام کاربری خود را وارد کنید"
                      {...field}
                      disabled={isPending}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <Label>رمز عبور</Label>

                    <Input
                      type="password"
                      placeholder="رمز عبور خود را وارد کنید"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? "" : Number(value));
                      }}
                      {...field}
                      disabled={isPending}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className={"flex-1"}>
                    <Label>تایید رمز عبور</Label>

                    <Input
                      type="password"
                      placeholder="رمز عبور را دوباره وارد کنید"
                      {...field}
                      disabled={isPending}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem className={"flex-1 mx-auto"}>
                    <FormLabel>برای</FormLabel>
                    <AutoCompleteV2
                      value={field.value}
                      onChange={field.onChange}
                      type="buyer-employe"
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Label>نقش</Label>
                  <SelectInput
                    field={field}
                    fullwidth={true}
                    lable2={"نقش کار بر را انتخاب کنین"}
                    options={[
                      {
                        value: "employe",
                        label: "کارمند",
                      },
                      {
                        value: "admin",
                        label: "ادمین",
                      },
                    ]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                "ثبت نام"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
