import { Card, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableRegister } from "../Table";
import { getAllAccount } from "@/services/accountService";
import { DataTableUnit } from "../unit/Table";
import { DataTableProduct } from "../product/Table";
import { getAllUnit } from "@/services/unitService";
import { getAllProduct } from "@/services/productService";
import { DataTableCostTital } from "../costTital/Table";
import { DataTableProceedTital } from "../proceedTital/Table";
import { getAllCostTital } from "@/services/costTitalService";
import { getAllProceedTital } from "@/services/proceedTitalService";

async function AccountTabs({ filter }) {
  const account = await getAllAccount(filter, {
    next: { tags: ["account"] },
  });
  const product = await getAllProduct(filter, {
    next: { tags: ["product"] },
  });
  const unit = await getAllUnit(filter, {
    next: { tags: ["unit"] },
  });
  const costTital = await getAllCostTital(filter, {
    next: { tags: ["costTital"] },
  });
  const proceedTital = await getAllProceedTital(filter, {
    next: { tags: ["proceedTital"] },
  });

  return (
    <Tabs defaultValue="account" className="w-full " dir="rtl">
      <TabsList className={"flex justify-end"}>
        <TabsTrigger value="account">صورت حساب</TabsTrigger>
        <TabsTrigger value="product">محصولات</TabsTrigger>
        <TabsTrigger value="unit">واحدات </TabsTrigger>
        <TabsTrigger value="costTital"> کتگوری مصارف</TabsTrigger>
        <TabsTrigger value="proceedTital">کتگوری عواید </TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className={"p-5 shadow-xl gap-0"}>
          <CardHeader className={"text-right "}>
            <h2 className={"text-2xl font-bold"}> صورت حساب ها </h2>
          </CardHeader>
          <DataTableRegister
            data={account.result?.result || []}
            count={account.result?.count}
          />
        </Card>
      </TabsContent>
      <TabsContent value="product">
        <Card className={"p-5 shadow-xl gap-0"}>
          <CardHeader className={"text-right "}>
            <h2 className={"text-2xl font-bold"}> محصولات</h2>
          </CardHeader>
          <DataTableProduct
            data={product.result?.result || []}
            count={product.result?.count}
          />
        </Card>
      </TabsContent>
      <TabsContent value="unit">
        {" "}
        <Card className={"p-5 shadow-xl gap-0"}>
          <CardHeader className={"text-right "}>
            <h2 className={"text-2xl font-bold"}>واحدات</h2>
          </CardHeader>
          <DataTableUnit
            data={unit.result?.result || []}
            count={unit.result?.count}
          />
        </Card>
      </TabsContent>
      <TabsContent value="costTital">
        {" "}
        <Card className={"p-5 shadow-xl gap-0"}>
          <CardHeader className={"text-right "}>
            <h2 className={"text-2xl font-bold"}>کتگوری مصارف</h2>
          </CardHeader>
          <DataTableCostTital
            data={costTital.result?.result || []}
            count={costTital.result?.count}
          />
        </Card>
      </TabsContent>
      <TabsContent value="proceedTital">
        {" "}
        <Card className={"p-5 shadow-xl gap-0"}>
          <CardHeader className={"text-right "}>
            <h2 className={"text-2xl font-bold"}>کتگوری عواید</h2>
          </CardHeader>
          <DataTableProceedTital
            data={proceedTital.result?.result || []}
            count={proceedTital.result?.count}
          />
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default AccountTabs;
