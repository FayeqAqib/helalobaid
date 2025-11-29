import { Sale } from "@/models/Sale";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // اگر اتصال لازم باشد
import { format } from "date-fns";
import { Bill } from "@/models/billHeaderAndFooter";
import { fromatDate } from "@/lib/utils";

export async function GET(req) {
  await connectDB(); // اگر از Mongoose استفاده می‌کنی

  const url = new URL(req.url);
  const _id = url.searchParams.get("_id");

  const sale = await Sale.findById(_id)
    .populate("buyer", "name")
    .populate("items.product", "name companyName brand ")
    .populate("items.id", "expirationDate badgeNumber");

  const headerAndFooter = await Bill.findOne();

  const html = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>بل فروش</title>
  <style>
    @page {
page:A4
      margin: 1cm;
    }
    body {
      width: 90%;
      height: auto;
      margin: auto;
      font-family: "Vazir", "Tahoma", sans-serif;
      background: #fefefe;
      color: #222;
      padding: 5px;
      box-sizing: border-box;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #4a90e2;
      padding-bottom: 10px;
    }
    header h1 {
      font-size: 24px;
      color: #4a90e2;
      margin: 0;
    }
    header p {
      font-size: 13px;
      color: #666;
      margin-top: 4px;
    }
    .info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      font-size: 14px;
      margin-bottom: 12px;
    }
    .info div {
      background: #eaf4ff;
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #cce0f5;
    }
    .customer {
      background: #eaf4ff;
      padding: 6px 10px;
      border-radius: 4px;
      border: 1px solid #cce0f5;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 10px;
    }
    th {
      background: green;
      color: white;
      padding: 8px;
      border: 1px solid #ccc;
    }
    td {
      border: 1px solid #ccc;
      padding: 6px;
      text-align: center;
    }
    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .summary {
      margin-top: 15px;
      font-size: 14px;
      text-align: right;
      background: #f0f8ff;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #cce0f5;
    }
    .summary p {
      margin: 4px 0;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      text-align: center;
      border-top: 1px dashed #aaa;
      padding-top: 10px;
      color: #666;
    }
  </style>
</head>
<body>
  <header>
   <img src="${
     headerAndFooter?.header
   }" alt="هدر شرکت" style="width:100%; max-height:100px; object-fit:contain;" />
  </header>

  <div class="info">
    <div>تاریخ: ${fromatDate(sale.date)}</div>
    <div>شماره بل: ${sale.billNumber}</div>

    </div>
    <div class="customer" >نام مشتری: ${sale.buyer?.name} </div>

  <table>
    <thead>
      <tr>
        <th>شماره</th>
        <th> اسم</th>
        <th>کمپنی</th>
        <th>برند</th>
        <th>بج نمبر</th>
        <th>تاریخ انقضاء</th>
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
        <td>${item.product?.companyName ? item.product?.companyName : ""}</td>
        <td>${item.product?.brand ? item.product?.brand : ""}</td>
        <td>${item.id?.badgeNumber}</td>
        <td>${
          item.id?.expirationDate ? format(item.id?.expirationDate, "PPP") : ""
        }</td>
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
