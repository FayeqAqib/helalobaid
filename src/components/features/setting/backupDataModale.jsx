"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";

import axios from "axios";

// const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || `https://helalobaid.mega-byte.info`;
const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL || `http://localhost:3000`;

export function BackupModal({
  children,
  open,
  type = "create",
  onOpen,
  discreption,
  tital,
  variant,
}) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (type === "create") {
        try {
          const result = await axios.get(`${baseUrl}/api/createBackUp`);

          if (result.status === 200) {
            toast.success(" دیتای پشتیبان با موفقیت ثبت شد");
            onOpen(false);
          }
        } catch (err) {
          toast.error(
            "در ایجاد دیتای پشتیبان شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      } else if (type === "update") {
        try {
          const result = await axios.get(`${baseUrl}/api/useBackUp`);

          if (result.status === 200) {
            toast.success(" دیتای پشتیبان با موفقیت آپدیت شد");
            onOpen(false);
          }
        } catch {
          toast.error(
            "در آپدیت دیتای پشتیبان شما مشکلی به وجود آمده لطفا بعدا دوباره تلاش کنید"
          );
        }
      } else {
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={"text-right"}> {tital}</DialogTitle>
          <DialogDescription className={"text-right"}>
            {discreption}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button className=" cursor-pointer" variant={"outline"}>
              لغو
            </Button>
          </DialogClose>
          <Button
            variant={variant}
            className=" cursor-pointer px-6"
            onClick={handleClick}
            disabled={isPending}
          >
            {" "}
            {isPending ? (
              <Loader2Icon className="animate-spin mr-2" />
            ) : (
              " اجرأ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
