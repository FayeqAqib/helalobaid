"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import months from "moment-jalaali";
import React, { useState } from "react";
import { BackupModal } from "./backupDataModale";
import { DialogTrigger } from "@/components/ui/dialog";

export const BackupCard = ({ backup }) => {
  const [Open1, setOpen1] = useState(false);
  const [Open2, setOpen2] = useState(false);
  const [Open3, setOpen3] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle> بشتیبان گیری</CardTitle>
      </CardHeader>
      <CardContent className={"flex flex-row justify-center gap-4"}>
        <div className="flex flex-col gap-4 justify-center items-center">
          <BackupModal
            open={Open1}
            onOpen={setOpen1}
            discreption={
              "کاربر گرامی برای حفظ م نگهداری بهتر اطلاعات خود حداقل هفته یک بار از اطلاعات خود پستیبان کیری کنید . و قابل یاد آوری است که در پشتیبان گیری از عکس ها و فایل ها پشتیبان گرفته نمی شود"
            }
            tital={"پشتیبان گیری"}
          >
            <DialogTrigger>
              <Button>ایجاد پشتیبان</Button>
            </DialogTrigger>
          </BackupModal>
          {backup ? (
            <CardDescription>
              <Badge variant={"outline"}>
                {months(backup.date).format("jYYYY/jMM/jDD")}
              </Badge>
            </CardDescription>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <BackupModal
            variant={"destructive"}
            type={"reset"}
            open={Open2}
            onOpen={setOpen2}
            tital={"حذف تمام اطلاعات"}
            discreption={
              "با اجرای این عمل مطمعن شوید که از اطلاعات خود پشتیبان گیری کرده باشین جود تمام اطلاعات شما به صورت کامل حذف می شود"
            }
          >
            <DialogTrigger>
              <Button variant={"destructive"}>حذف تمام دیتا ها</Button>
            </DialogTrigger>
          </BackupModal>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <BackupModal
            type={"update"}
            open={Open3}
            onOpen={setOpen3}
            tital={"بارگذاری اطلاعات قبلی"}
            discreption={
              "با اجرای این دستور اطلاعاتی که قبلا پشتیبان گیر کرده بودین جای گذین اطلاعات فعلی شما می شود"
            }
          >
            <DialogTrigger>
              <Button variant={"outline"}>اجرأ بشتیبان</Button>
            </DialogTrigger>
          </BackupModal>
        </div>
      </CardContent>
    </Card>
  );
};
