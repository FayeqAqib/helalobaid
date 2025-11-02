"use client";

import { createExpirationAction } from "@/actions/expirationAction";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

const Expiration = ({ expiration: expir }) => {
  const [expiring, setExpiring] = useState(expir?.expiring);
  const [count, setCount] = useState(expir?.count);
  const [isPending, startTransition] = useTransition();

  function handleUpdateExpiration() {
    startTransition(async () => {
      const result = await createExpirationAction({ expiring, count });

      if (!result?.err) {
        toast.success("هشدار شما با موفقیت ثبت شد");
      } else {
        toast.error(
          "در ثبت هشدار شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش  کنید"
        );
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>هشدار</CardTitle>
        <CardDescription>
          {" "}
          مشخص کنید که در چی تاریخ و در چی تعدادی برای شما هشدار بدهد
        </CardDescription>
      </CardHeader>
      <CardContent className={"space-y-5"}>
        <div className="flex flex-row gap-3">
          <div className="space-y-3 flex-1">
            <Label> هشدار تاریخ</Label>
            <Input
              type={"number"}
              value={expiring}
              onChange={(e) => setExpiring(e.target.value)}
            />
          </div>
          <div className="space-y-3  flex-1">
            <Label> هشدار تعداد</Label>
            <Input
              type={"number"}
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        </div>
        <Button
          type="button"
          className={"w-full"}
          onClick={handleUpdateExpiration}
          disabled={isPending}
        >
          {isPending ? <Loader2 /> : "اجرا"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Expiration;
