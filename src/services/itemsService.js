import { catchAsync } from "@/lib/catchAsync";
import { Buy } from "@/models/Buy";
import { Items } from "@/models/items";

export const getListOfItems = catchAsync(async (filter) => {
  const filt = { count: { $gt: 0 } };
  if (filter !== "") filt.depot = filter;

  const result = await Items.find(filt, {
    aveUnitAmount: 1,
    saleAmount: 1,
    product: 1,
    unit: 1,
    depot: 1,
    count: 1,
  })
    .populate(["unit", "depot"], "name")
    .populate("product", ["name", "brand", "companyName"]);
  return result;
});

export const getAllItemsForBarChart = catchAsync(async (depot) => {
  return await Items.find({ depot }, { product: 1, count: 1 }).populate(
    "product",
    "name"
  );
});

export const getAllItems = catchAsync(async () => {
  return await Items.find({}, { count: 1 });
});

export const getAllItemsForTable = catchAsync(async (filter) => {
  const page = Number(filter.page) || 0;
  const limit = Number(filter.limit) || 10;
  const skip = page * limit;

  const table = await Items.find({ depot: filter.depot })
    .limit(limit)
    .skip(skip)
    .populate(["unit"], "name")
    .populate("product", ["name", "brand", "companyName"]);
  const count = await Items.countDocuments(filter);

  return { table, count };
});

//////////////////////////////////////////////////////////// COUNT BY Expiration ///////////////////////////////

export const getExpiration = catchAsync(async () => {
  const today = new Date();
  let fifteenDaysLater = new Date();
  fifteenDaysLater.setDate(fifteenDaysLater.getDate() + 15);
  const Expiring = await Items.countDocuments({
    count: { $gt: 0 },
    expirationDate: {
      $exists: true,
      $ne: null,
      $gt: today,
      $lt: fifteenDaysLater,
    },
  });
  const Expired = await Items.countDocuments({
    count: { $gt: 0 },
    expirationDate: { $exists: true, $ne: null, $lte: today },
  });

  return { Expired, Expiring };
});

export const getSalesPurchaseSummary = catchAsync(async () => {
  const today = new Date();

  // تاریخ چهار ماه قبل
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(today.getMonth() - 4);

  const result = await Buy.aggregate([
    // ==================== مرحله ۱: فیلتر کردن خریدها بر اساس تاریخ ====================
    {
      $match: {
        date: {
          $gte: fourMonthsAgo,
          $lte: today,
        },
      },
    },

    // ==================== مرحله ۲: گروه‌بندی خریدها بر اساس تاریخ میلادی ====================
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "+04:30", // زمان تهران (افغانستان)
          },
        },
        totalBuy: { $sum: "$totalAmount" },
        buyCount: { $sum: "$totalCount" }, // اضافه کردن buyCount
        transactionBuy: { $sum: 1 },
      },
    },

    // ==================== مرحله ۳: شکل‌دهی داده‌های خرید ====================
    {
      $project: {
        date: "$_id",
        totalBuy: 1,
        buyCount: 1, // اضافه کردن buyCount
        totalSale: { $literal: 0 },
        totalProfit: { $literal: 0 },
        saleCount: { $literal: 0 }, // مقدار پیش‌فرض برای saleCount
        transactionBuy: 1,
        type: { $literal: "buy" },
        _id: 0,
      },
    },

    // ==================== مرحله ۴: ادغام با داده‌های فروش ====================
    {
      $unionWith: {
        coll: "sales",
        pipeline: [
          // فیلتر کردن فروش‌ها بر اساس تاریخ
          {
            $match: {
              date: {
                $gte: fourMonthsAgo,
                $lte: today,
              },
            },
          },

          // گروه‌بندی فروش‌ها بر اساس تاریخ میلادی
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$date",
                  timezone: "+04:30", // زمان تهران (افغانستان)
                },
              },
              totalSale: { $sum: "$totalAmount" },
              totalProfit: { $sum: "$totalProfit" }, // اضافه کردن saleCount
              saleCount: { $sum: "$totalCount" }, // اضافه کردن saleCount
              transactionSale: { $sum: 1 },
            },
          },

          // شکل‌دهی داده‌های فروش
          {
            $project: {
              date: "$_id",
              totalSale: 1,
              totalProfit: 1, // اضافه کردن totalProfit
              saleCount: 1, // اضافه کردن saleCount
              totalBuy: { $literal: 0 }, // تغییر از 0 به { $literal: 0 }

              buyCount: { $literal: 0 }, // مقدار پیش‌فرض برای buyCount
              transactionSale: 1,
              type: { $literal: "sale" },
              _id: 0,
            },
          },
        ],
      },
    },

    // ==================== مرحله ۵: گروه‌بندی نهایی بر اساس تاریخ ====================
    {
      $group: {
        _id: "$date",
        totalBuy: { $sum: "$totalBuy" },
        buyCount: { $sum: "$buyCount" }, // اضافه کردن buyCount
        totalSale: { $sum: "$totalSale" },
        totalProfit: { $sum: "$totalProfit" },
        saleCount: { $sum: "$saleCount" }, // اضافه کردن saleCount
        transactionBuy: { $sum: "$transactionBuy" },
        transactionSale: { $sum: "$transactionSale" },
      },
    },

    // ==================== مرحله ۷: شکل‌دهی نهایی خروجی ====================
    {
      $project: {
        date: "$_id",
        totalBuy: 1,
        buyCount: 1, // اضافه کردن buyCount
        totalSale: 1,
        saleCount: 1, // اضافه کردن saleCount
        totalProfit: 1,
        transactionBuy: 1,
        transactionSale: 1,
        totalTransactions: 1,
        _id: 0,
      },
    },

    // ==================== مرحله ۸: مرتب‌سازی بر اساس تاریخ ====================
    {
      $sort: { date: 1 },
    },
  ]);

  return result;
});

// ==================== نحوه استفاده از تابع ====================
// const summary = await getSalesPurchaseSummary(
//   "2024-01-01", // تاریخ شروع (اختیاری)
//   "2024-12-31" // تاریخ پایان (اختیاری)
// );

// console.log(summary);
