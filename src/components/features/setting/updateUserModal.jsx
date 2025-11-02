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

import { Label } from "@/components/ui/label";
import { updateUserAction } from "@/actions/user";

const signupSchema = z
  .object({
    username: z
      .string({ required_error: "الزامی" })
      .min(3, "حداقل 3 کاراکتر وارد کنید"),
    password: z
      .string({ required_error: "الزامی" })
      .min(4, "حداقل 4 کاراکتر وارد کنید"),
    confirmPassword: z
      .string({ required_error: "الزامی" })
      .min(4, "لطفا تایید رمز عبور را وارد کنید"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تایید آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || `http://localhost:3000`;

export function UpdateUserModal({ children, data, open, onOpen }) {
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(signupSchema),
  });

  function submiteForm(myData) {
    startTransition(async () => {
      const result = await updateUserAction({ ...myData, _id: data._id });
      if (!result.err) {
        toast.success("حساب کاربری با موفقیت آپدیت شد");
        form.reset();
        onOpen(false);
      } else {
        toast.error(
          "در آپدیت حساب کاربری شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}> آپدیت کاربر </DialogTitle>
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
                      className={"flex-1"}
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
            </div>

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
