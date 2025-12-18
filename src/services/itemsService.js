import { catchAsync } from "@/lib/catchAsync";
import { Buy } from "@/models/Buy";
import { Expiration } from "@/models/expiration";
import { Items } from "@/models/items";
import momentT from "moment-timezone";

export const getListOfItems = catchAsync(async (filter) => {
  const filt = { count: { $gt: 0 } };
  if (filter !== "") filt.depot = filter;

  // const result = await Items.aggregate([
  //   {
  //     $match: {
  //       count: { $eq: 0 },
  //       ...(filter !== "" ? { depot: filter } : {}),
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: {
  //         badgeNumber: "$badgeNumber",
  //         product: "$product",
  //         unit: "$unit",
  //         depot: "$depot",
  //       },
  //       totalCount: { $sum: "$count" },
  //       weightedSaleSum: { $sum: { $multiply: ["$saleAmount", "$count"] } },
  //       weightedAveUnitSum: {
  //         $sum: { $multiply: ["$aveUnitAmount", "$count"] },
  //       },
  //     },
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       totalCount: 1,
  //       saleAmount: {
  //         $cond: [
  //           { $eq: ["$totalCount", 0] },
  //           0,
  //           { $divide: ["$weightedSaleSum", "$totalCount"] },
  //         ],
  //       },
  //       aveUnitAmount: {
  //         $cond: [
  //           { $eq: ["$totalCount", 0] },
  //           0,
  //           { $divide: ["$weightedAveUnitSum", "$totalCount"] },
  //         ],
  //       },
  //     },
  //   },
  //   // پاپولیت محصول
  //   {
  //     $lookup: {
  //       from: "products",
  //       localField: "_id.product",
  //       foreignField: "_id",
  //       as: "product",
  //     },
  //   },
  //   { $unwind: "$product" },

  //   // پاپولیت واحد (unit)
  //   {
  //     $lookup: {
  //       from: "units",
  //       localField: "_id.unit",
  //       foreignField: "_id",
  //       as: "unit",
  //     },
  //   },
  //   { $unwind: "$unit" },

  //   {
  //     $lookup: {
  //       from: "depots",
  //       localField: "_id.depot",
  //       foreignField: "_id",
  //       as: "depot",
  //     },
  //   },
  //   { $unwind: "$depot" },

  //   // فقط فیلدهای مورد نیاز
  //   {
  //     $project: {
  //       _id: 1,
  //       count: "$totalCount", // تغییر نام totalCount به count
  //       saleAmount: 1,
  //       aveUnitAmount: 1,
  //       "product._id": 1,
  //       "product.name": 1,
  //       "product.brand": 1,
  //       "product.companyName": 1,
  //       "product.image": 1,
  //       "unit._id": 1,
  //       "unit.name": 1,
  //       "depot._id": 1,
  //       "depot.name": 1,
  //     },
  //   },
  // ]);
  // return result;
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
  const filter = depot !== "undefined" ? { depot: depot } : {};
  return await Items.find(filter, { product: 1, count: 1 }).populate(
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

  const depot = filter.depot;
  let my = {};
  if (depot !== "undefined") {
    my = { depot: depot };
  }

  const expir = (await Expiration.findOne({})) || { expiring: 15, count: 15 };
  const table =
    (await Items.find(my)
      .limit(limit)
      .skip(skip)
      .populate(["unit"], "name")
      .populate("product", ["name", "brand", "companyName"])) || "";
  const count = await Items.countDocuments();

  return { table, count, expir };
});

//////////////////////////////////////////////////////////// COUNT BY Expiration ///////////////////////////////

export const getExpiration = catchAsync(async (filter) => {
  const expir = (await Expiration.findOne()) || { expiring: 15 };
  const today = new Date();

  let fifteenDaysLater = new Date();
  fifteenDaysLater.setDate(fifteenDaysLater.getDate() + expir.expiring);

  const fil = filter?.depot !== "undefined" ? { depot: filter?.depot } : {};
  const Expiring = await Items.countDocuments({
    count: { $gt: 0 },
    expirationDate: {
      $exists: true,
      $ne: null,
      $gt: today,
      $lt: fifteenDaysLater,
    },
    ...fil,
  });
  const Expired = await Items.countDocuments({
    count: { $gt: 0 },
    expirationDate: { $exists: true, $ne: null, $lte: today },
    ...fil,
  });

  return { Expired, Expiring };
});

export const getSalesPurchaseSummary = catchAsync(
  async ({ date = "", currency }) => {
    const currency_id = currency?.split("_")[1];
    const [startD, endD] = date?.split(",");
    const start = momentT(startD || new Date()).format("jYYYY/jMM/jDD");
    const end = momentT(endD || new Date()).format("jYYYY/jMM/jDD");

    const startDate = momentT
      .tz(start, "jYYYY/jMM/jDD", "Asia/Kabul")
      .startOf("day")
      .toDate();
    console.log(currency);

    const endDate = momentT
      .tz(end, "jYYYY/jMM/jDD", "Asia/Kabul")
      .endOf("day")
      .toDate();

    // const today = new Date();

    // // تاریخ چهار ماه قبل
    // const fourMonthsAgo = new Date();
    // fourMonthsAgo.setMonth(today.getMonth() - 4);

    const result = await Buy.aggregate([
      // ==================== مرحله ۱: فیلتر کردن خریدها بر اساس تاریخ ====================
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          ...(currency_id ? { "currency._id": currency_id } : {}),
        },
      },
      // {
      //   $match: {
      //     date: {
      //       $gte: fourMonthsAgo,
      //       $lte: today,
      //     },
      //   },
      // },

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
          totalBuy: currency_id
            ? { $sum: { $divide: ["$totalAmount", "$currency.rate"] } }
            : { $sum: "$totalAmount" },
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
                date: { $gte: startDate, $lte: endDate },
                ...(currency_id ? { "currency._id": currency_id } : {}),
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
                totalSale: currency_id
                  ? {
                      $sum: { $divide: ["$totalAmount", "$currency.rate"] },
                    }
                  : { $sum: "$totalAmount" },
                totalProfit: currency_id
                  ? { $sum: { $divide: ["$totalProfit", "$currency.rate"] } }
                  : { $sum: "$totalProfit" }, // اضافه کردن saleCount
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
  }
);

// ==================== نحوه استفاده از تابع ====================
// const summary = await getSalesPurchaseSummary(
//   "2024-01-01", // تاریخ شروع (اختیاری)
//   "2024-12-31" // تاریخ پایان (اختیاری)
// );

// console.log(summary);
