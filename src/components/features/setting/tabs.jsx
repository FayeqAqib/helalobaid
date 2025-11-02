import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { DataTableUser } from "./UserTable";
import { ExportDataCard } from "./exportDateCard";
import { BackupCard } from "./backupCard";
import Expiration from "./expiration";
import Bill from "./bill";

const Tab = ({ data, backup, bill, expiration }) => {
  return (
    <Tabs defaultValue="user" className="w-full" dir="rtl">
      <TabsList>
        <TabsTrigger value="expiration">هشدار ها </TabsTrigger>
        <TabsTrigger value="billHeader">بل </TabsTrigger>
        <TabsTrigger value="exportData">خروجی دیتا</TabsTrigger>
        <TabsTrigger value="backup">پشتیبان گیری</TabsTrigger>
        <TabsTrigger value="user">کاربر ها</TabsTrigger>
      </TabsList>
      <TabsContent value="user">
        {" "}
        <DataTableUser
          data={data.result?.result || []}
          count={data.result?.count}
        />
      </TabsContent>
      <TabsContent value="backup">
        {" "}
        <BackupCard backup={backup} />
      </TabsContent>
      <TabsContent value="exportData">
        {" "}
        <ExportDataCard />
      </TabsContent>
      <TabsContent value="expiration">
        <Expiration expiration={expiration} />
      </TabsContent>
      <TabsContent value="billHeader">
        <Bill bill={bill} />
      </TabsContent>
    </Tabs>
  );
};

export default Tab;
