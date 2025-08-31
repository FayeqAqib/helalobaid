"use client";
import {
  createMarqueeAction,
  deleteMarqueeAction,
} from "@/actions/marqueeAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateMarquee = ({ text }) => {
  console.log(text);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { text } });
  const [isPending, startTransition] = useTransition();
  function onSubmit(formdata) {
    startTransition(async () => {
      const result = await createMarqueeAction(formdata.text);
      if (!result.err) {
        toast.success("اطلاعیه شما با موفقیت ثبت شد");
      } else {
        toast.error(
          "در ثبت اطلاعیه شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }

  function deleteMarquee() {
    startTransition(async () => {
      const result = await deleteMarqueeAction();
      if (!result.err) {
        toast.success("اطلاعیه شما با موفقیت حذف شد");
        setValue("text", "");
      } else {
        toast.error(
          "در حذف اطلاعیه شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
        );
      }
    });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>اطلاعیه</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-end gap-2  max-h-[300px] w-[340px] "
        >
          <Textarea
            type={"text"}
            {...register("text")}
            className={"flex-1 max-h-[100px] "}
          />
          <div className="space-x-2">
            <Button
              type="button"
              variant={"destructive"}
              onClick={deleteMarquee}
              disabled={isPending}
            >
              {" "}
              حذف کردن
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                " ذخیره کردن"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateMarquee;
