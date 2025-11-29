import { Sale } from "@/models/Sale";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // اگر اتصال لازم باشد
import { format } from "date-fns";
import { Bill } from "@/models/billHeaderAndFooter";
import moment from "moment-jalaali";
import { fromatDate } from "@/lib/utils";

export async function GET(req) {
  await connectDB(); // اگر از Mongoose استفاده می‌کنی

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  const sale = await Sale.findById(_id)
    .populate(["items.product", "buyer"], "name")
    .populate("items.id", "badgeNumber");

  const headerAndFooter = await Bill.findOne();

  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>بل فروش</title>
  <style>
 @page {
  size: 80mm auto;
  margin: 5mm;
}
body {
  width: 80mm;
  margin: auto;
  font-family: "Vazir", "Tahoma", sans-serif;
  font-size: 12px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
th, td {
  border: 1px dashed #000;
  padding: 4px;
  text-align: center;
}

  </style>
</head>
<body>
  <header>
   <img src="${
     headerAndFooter?.header || "/Ajmal.png"
   }" alt="هدر شرکت" style="width:100%; max-height:100px; object-fit:contain; margin:10px 0px ;" />
  </header>

  <div class="info">
    <div>تاریخ: ${fromatDate(new Date(sale.date))}</div>
    <div>شماره بل: ${sale.billNumber}</div>
    
    </div>
    <div class="customer" >نام مشتری: ${sale.buyer?.name} </div>

  <table>
    <thead>
      <tr>
        <th>شماره</th>
        <th> اسم</th>
        <th>تعداد</th>
        <th>قیمت واحد</th>
        <th> تخفیف</th>
        <th>مجموع</th>
        <th>با تخفیف</th>
      </tr>
    </thead>
    <tbody>
     ${sale.items?.map(
       (item, i) =>
         ` <tr>
        <td>${i + 1}</td>
        <td>${item.product?.name}</td>
        <td>${item.count}</td>
        <td>${item.saleAmount}</td>
        <td>${item.discount}%</td>
        <td>${item.saleAmount * item.count}</td>
        <td>${item.amountBeforDiscount}</td>
      </tr>`
     )}
    </tbody>
  </table>

  <div class="summary">
    <p><strong>جمع کل:</strong> ${sale.totalAmountBeforDiscount} افغانی</p>
    <p><strong>تخفیف:</strong> ${
      sale.totalAmountBeforDiscount - sale.totalAmount
    } افغانی</p>
    <p><strong>مبلغ قابل پرداخت:</strong> ${sale.totalAmount} افغانی</p>
    <p><strong>پرداخت نقدی:</strong> ${sale.cashAmount} افغانی</p>
    <p><strong>باقی مانده:</strong> ${sale?.lendAmount || 0} افغانی</p>
  </div>

  <div class="footer">
     <img src="${
       headerAndFooter?.footer
     }" alt="هدر شرکت" style="width:100%; max-height:100px; object-fit:contain;" />
  </div>

  <script>
    window.onload = () => window.print();
  </script>
</body>
</html>
`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html" },
  });
}
