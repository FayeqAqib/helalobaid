import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PrinterIcon, DownloadIcon, Share2Icon } from "lucide-react";
import jalaliMoment from "moment-jalaali";

const sale = {
  _id: "sale_12345678",
  date: new Date(),
  buyer: {
    name: "احمد کریمی",
    phone: "0790123456",
    address: "کابل، منطقه کارته سخی، کوچه تعلیم و تربیه",
  },
  cashAmount: 150000,
  lendAmount: 50000,
  totalAmount: 200000,
  cent: 15,
  metuAmount: 300,
  details: "این یک خرید آزمایشی برای نمایش قابلیت‌های سیستم است",
  items: [
    { name: "لپ تاپ دل مدل XPS 15", price: 120000, quantity: 1 },
    { name: "ماوس بی سیم لاجیتک", price: 1500, quantity: 2 },
    { name: "کیبورد مکانیکی", price: 3500, quantity: 1 },
    { name: "هدست گیمینگ", price: 8000, quantity: 1 },
  ],
};
const InvoiceCard = () => {
  // تبدیل تاریخ به فرمت افغانستان
  const formattedDate = jalaliMoment(sale.date).format("jYYYY/jM/jD");

  // محاسبه مجموع آیتم‌ها
  const subtotal = sale.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">فروشگاه متو</h1>
              <p className="text-blue-100 mt-1">
                کابل، شهر نو، جاده میوند، پلاک ۱۲۳
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold">بل خرید</h2>
              <div className="flex items-center justify-end mt-2 gap-3">
                <Badge
                  variant="secondary"
                  className="text-sm bg-white text-indigo-700"
                >
                  شماره: {sale._id.slice(-8).toUpperCase()}
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-sm bg-white text-indigo-700"
                >
                  تاریخ: {formattedDate}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* اطلاعات خریدار */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                اطلاعات خریدار
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">نام:</span>
                  <span className="font-bold">{sale.buyer.name}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">شماره تماس:</span>
                  <span>{sale.buyer.phone || "-"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">آدرس:</span>
                  <span className="text-right">
                    {sale.buyer.address || "-"}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                جزئیات پرداخت
              </h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">روش پرداخت:</span>
                  <span>{sale.paymentMethod === "cash" ? "نقدی" : "نسیه"}</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">پول نقد:</span>
                  <span>{sale.cashAmount.toLocaleString()} افغانی</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium text-gray-600">باقی مانده:</span>
                  <span>{sale.lendAmount.toLocaleString()} افغانی</span>
                </p>
              </div>
            </div>
          </div>

          {/* لیست آیتم‌های خرید */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              لیست خرید
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-right font-semibold text-gray-600 border-b">
                      کالا
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 border-b">
                      تعداد
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 border-b">
                      فی واحد
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-gray-600 border-b">
                      مجموع
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="py-3 px-4 text-right border-b">
                        {item.name}
                      </td>
                      <td className="py-3 px-4 text-center border-b">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-center border-b">
                        {item.price.toLocaleString()} افغانی
                      </td>
                      <td className="py-3 px-4 text-center border-b font-medium">
                        {(item.price * item.quantity).toLocaleString()} افغانی
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* خلاصه مالی */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                مجموع فروش
              </h3>
              <p className="text-3xl font-bold text-gray-800 text-center">
                {sale.totalAmount.toLocaleString()} افغانی
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">
                فیصدی
              </h3>
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeDasharray={`${sale.cent}, 100`}
                    />
                    <text
                      x="18"
                      y="22"
                      textAnchor="middle"
                      fill="#4f46e5"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {sale.cent}%
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                مقدار متو
              </h3>
              <p className="text-3xl font-bold text-gray-800 text-center">
                {sale.metuAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* توضیحات */}
          {sale.details && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">توضیحات:</h4>
              <p className="text-gray-600">{sale.details}</p>
            </div>
          )}
        </CardContent>

        <Separator className="bg-gray-200" />

        <CardFooter className="p-6 bg-gray-50">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-600">شماره تماس: ۰۷۹۰۱۲۳۴۵۶</p>
              <p className="text-sm text-gray-600">ایمیل: info@metu-shop.af</p>
            </div>
            <p className="text-sm text-gray-600">با تشکر از خرید شما!</p>
          </div>
        </CardFooter>
      </Card>

      {/* دکمه‌های عملیاتی */}
      <div className="mt-6 flex justify-center gap-4 print:hidden">
        <Button
          variant="default"
          className="bg-indigo-600 hover:bg-indigo-700 gap-2"
        >
          <PrinterIcon className="h-4 w-4" />
          چاپ بل
        </Button>
        <Button
          variant="outline"
          className="border-indigo-600 text-indigo-600 hover:bg-indigo-50 gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          ذخیره PDF
        </Button>
        <Button
          variant="outline"
          className="border-green-600 text-green-600 hover:bg-green-50 gap-2"
        >
          <Share2Icon className="h-4 w-4" />
          اشتراک گذاری
        </Button>
      </div>

      {/* واترمارک برای چاپ */}
      <div className="hidden print:block absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
        <div className="text-center">
          <div className="text-8xl font-bold text-gray-400 rotate-45">
            فروشگاه متو
          </div>
          <div className="text-4xl font-bold text-gray-400 rotate-45 mt-4">
            بل خرید
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCard;
