"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createUserAction from "@/actions/user";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { auth } from "@/lib/auth";
import { useSession } from "next-auth/react";

const RoleEnum = z.enum(["customer", "admin"]);

const signupSchema = z
  .object({
    username: z.string().min(3, "حداقل 3 کاراکتر وارد کنید"),
    password: z.string().min(6, "حداقل 6 کاراکتر وارد کنید"),
    confirmPassword: z.string().min(6, "لطفا تایید رمز عبور را وارد کنید"),
    role: RoleEnum,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "رمز عبور و تایید آن مطابقت ندارند",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "",
    },
  });

  const session = useSession();
  if (session.status === "loading") return null;
  if (session.status === "unauthenticated") {
    router.push("/login");
  }

  const onSubmit = (data) => {
    startTransition(async () => {
      const result = await createUserAction(data);
      if (result.result?.message) return toast.warning(result.result?.message);
      if (!result.err) {
        toast.success("حساب کاربری با موفقیت ثبت شد");
        form.reset();
        router.push("/customer/home");
      } else {
        toast.error(
          "در ایجاد حساب کاربری شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        animation: "gradientBG 5s ease-in-out infinite",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundSize: "200% 200%",
      }}
    >
      <style jsx global>{`
        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center mb-6">ثبت نام</h2>

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <Label>نام کاربری</Label>
                <FormControl>
                  <Input
                    placeholder="نام کاربری خود را وارد کنید"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <Label>رمز عبور</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <Label>تایید رمز عبور</Label>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="رمز عبور را دوباره وارد کنید"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <Label>نقش</Label>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="نقش خود را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer">مشتری</SelectItem>
                      <SelectItem value="admin">ادمین</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
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
    </div>
  );
}
