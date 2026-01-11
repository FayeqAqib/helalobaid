import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import { Cost } from "@/models/cost";
import { ExternalProceed } from "@/models/externalProceed";
import { Pay } from "@/models/pay";
import { Receive } from "@/models/receive";
import { Sale } from "@/models/Sale";
import { Transfer } from "@/models/transfer";
import moment from "moment-jalaali";
import momentT from "moment-timezone";
import mongoose from "mongoose";

// async function getAPIFeatures(query, queryString, pupulateField) {
//   const count = await query.countDocuments();
//   const features = new APIFeatures(query.find(), queryString)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const result = await features.query.populate(pupulateField, "name");

//   return [result, count];
// }

export const getaccountAlltransactions = catchAsync(async (filter) => {
  const myFilter = {};

  const page = parseInt(filter?.page) || 0;
  const limit = parseInt(filter?.limit) || 10;
  const skip = page * limit;

  if (filter.date) {
    const dates = filter.date.split(",");

    const start = momentT(dates[0]).format("jYYYY/jMM/jDD");
    const end = momentT(dates[1] || dates[0]).format("jYYYY/jMM/jDD");

    const startDate = momentT
      .tz(start, "jYYYY/jMM/jDD", "Asia/Kabul")
      .startOf("day")
      .toDate();

    const endDate = momentT
      .tz(end, "jYYYY/jMM/jDD", "Asia/Kabul")
      .endOf("day")
      .toDate();

    myFilter.date = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  const name = filter?.name?.split("_")?.[1] || null;

  let account;
  if (name) {
    account = await Account.findById(name);
  } else {
    account = null;
  }

  const create_id = (id) => mongoose.Types.ObjectId.createFromHexString(id);

  if (filter.currency) {
    myFilter["currency._id"] = filter.currency.split("_")[1];
  }

  const transactions = await Sale.aggregate([
    { $match: { ...(name ? { buyer: create_id(name) } : {}), ...myFilter } }, // فیلتر اولیه برای Sale
    {
      $lookup: {
        from: "accounts",
        localField: "buyer",
        foreignField: "_id",
        as: "buyerInfo",
      },
    },
    { $unionWith: "$buyerInfo" },
    {
      $project: {
        saleCashAmount: "$cashAmount",
        lendAmount: 1,
        date: 1,
        name: "$buyerInfo.name",
        currency: 1,
      },
    },
    {
      $unionWith: {
        coll: "buys",
        pipeline: [
          {
            $match: {
              ...(name ? { saller: create_id(name) } : {}),
              ...myFilter,
            },
          },
          {
            $lookup: {
              from: "accounts",
              localField: "saller",
              foreignField: "_id",
              as: "sallerInfo",
            },
          },
          { $unionWith: "$salerInfo" },
          {
            $project: {
              buyCashAmount: "$cashAmount",
              borrowAmount: 1,
              date: 1,
              name: "$sallerInfo.name",
              currency: 1,
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: "receives",
        pipeline: [
          {
            $match: { ...(name ? { type: create_id(name) } : {}), ...myFilter },
          },
          {
            $lookup: {
              from: "accounts",
              localField: "type",
              foreignField: "_id",
              as: "receiveType",
            },
          },
          { $unionWith: "$receiveType" },
          {
            $project: {
              receiveAmount: "$amount",
              date: 1,
              name: "$receiveType.name",
              currency: 1,
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: "pays",
        pipeline: [
          {
            $match: { ...(name ? { type: create_id(name) } : {}), ...myFilter },
          },
          {
            $lookup: {
              from: "accounts",
              localField: "type",
              foreignField: "_id",
              as: "payType",
            },
          },
          {
            $unionWith: "$payType",
          },
          {
            $project: {
              payAmount: "$amount",
              date: 1,
              name: "$payType.name",
              currency: 1,
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: "transfers",
        pipeline: [
          {
            $match: { ...(name ? { from: create_id(name) } : {}), ...myFilter },
          },
          {
            $lookup: {
              from: "accounts",
              localField: "from",
              foreignField: "_id",
              as: "fromInfo",
            },
          },
          {
            $unionWith: "$fromInfo",
          },
          {
            $project: {
              payAmount: "$amount",
              date: 1,
              name: "$fromInfo.name",
              currency: 1,
            },
          },
        ],
      },
    },
    {
      $unionWith: {
        coll: "transfers",
        pipeline: [
          { $match: { ...(name ? { to: create_id(name) } : {}), ...myFilter } },
          {
            $lookup: {
              from: "accounts",
              localField: "to",
              foreignField: "_id",
              as: "toInfo",
            },
          },
          { $unionWith: "$toInfo" },
          {
            $project: {
              receiveAmount: "$amount",
              date: 1,
              name: "$toInfo.name",
              currency: 1,
            },
          },
        ],
      },
    },

    {
      $facet: {
        data: [{ $sort: { date: -1 } }, { $skip: skip }, { $limit: limit }],
        count: [{ $count: "total" }],
      },
    },
  ]);

  return {
    result: transactions[0].data,
    account,
    count: transactions[0].count[0]?.total || 0,
  };
});

// export const getMetuLedger = catchAsync(async ({ date }) => {
//   const month = moment(date || new Date()).format("jYYYY/jM");
//   const saleTransactions = await Sale.aggregate([
//     {
//       $match: {
//         afgDate: `${month}`,
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$date" },
//         },
//         saleMetuAmount: { $sum: "$metuAmount" },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]);

//   const buyTransactions = await Buy.aggregate([
//     {
//       $match: {
//         afgDate: `${month}`,
//       },
//     },
//     {
//       $group: {
//         _id: {
//           $dateToString: { format: "%Y-%m-%d", date: "$date" },
//         },
//         buyMetuAmount: { $sum: "$metuAmount" },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $sort: {
//         _id: 1,
//       },
//     },
//   ]);
//   const allTransactions = {};

//   saleTransactions.forEach((sale) => {
//     allTransactions[sale._id] = {
//       date: sale._id,
//       saleMetuAmount: sale.saleMetuAmount || 0,
//       buyMetuAmount: 0,
//     };
//   });

//   buyTransactions.forEach((buy) => {
//     if (allTransactions[buy._id]) {
//       allTransactions[buy._id].buyMetuAmount = buy.buyMetuAmount || 0;
//     } else {
//       allTransactions[buy._id] = {
//         date: buy._id,
//         saleMetuAmount: 0,
//         buyMetuAmount: buy.buyMetuAmount || 0,
//       };
//     }
//   });

//   const allTransactionsArray = Object.values(allTransactions);

//   return {
//     allTransactionsArray,
//   };
// });

export const getLedgar = catchAsync(async ({ date, currency }) => {
  let filter = { afgDate: `${moment(date).format("jYYYY/jM")}` };

  if (currency) {
    filter["currency._id"] = currency;
  }

  const saleTransactions = await Sale.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kabul",
          },
        },
        saleCashAmount: currency
          ? { $sum: { $divide: ["$cashAmount", "$currency.rate"] } }
          : { $sum: "$cashAmount" },
        saleLendAmount: currency
          ? { $sum: { $divide: ["$lendAmount", "$currency.rate"] } }
          : { $sum: "$lendAmount" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const buyTransactions = await Buy.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kabul",
          },
        },
        buyCashAmount: currency
          ? { $sum: { $divide: ["$cashAmount", "$currency.rate"] } }
          : { $sum: "$cashAmount" },
        buyBorrowAmount: currency
          ? {
              $sum: { $divide: ["$borrowAmount", "$currency.rate"] },
            }
          : { $sum: "$borrowAmount" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const receiveTransactions = await Receive.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kabul",
          },
        },
        receiveAmount: currency
          ? { $sum: { $divide: ["$amount", "$currency.rate"] } }
          : { $sum: "$amount" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);

  const payTransactions = await Pay.aggregate([
    {
      $match: {
        ...filter,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$date",
            timezone: "Asia/Kabul",
          },
        },
        payAmount: currency
          ? { $sum: { $divide: ["$amount", "$currency.rate"] } }
          : { $sum: "$amount" },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  const allTransactions = {};

  saleTransactions.forEach((sale) => {
    allTransactions[sale._id] = {
      date: sale._id,
      saleCashAmount: sale.saleCashAmount || 0,
      saleLendAmount: sale.saleLendAmount || 0,
      buyCashAmount: 0,
      buyBorrowAmount: 0,
      receiveAmount: 0,
      payAmount: 0,
    };
  });

  buyTransactions.forEach((buy) => {
    if (allTransactions[buy._id]) {
      allTransactions[buy._id].buyCashAmount = buy.buyCashAmount || 0;
      allTransactions[buy._id].buyBorrowAmount = buy.buyBorrowAmount || 0;
    } else {
      allTransactions[buy._id] = {
        date: buy._id,
        saleCashAmount: 0,
        saleLendAmount: 0,
        buyCashAmount: buy.buyCashAmount || 0,
        buyBorrowAmount: buy.buyBorrowAmount || 0,
        receiveAmount: 0,
        payAmount: 0,
      };
    }
  });

  receiveTransactions.forEach((receive) => {
    if (allTransactions[receive._id]) {
      allTransactions[receive._id].receiveAmount = receive.receiveAmount || 0;
    } else {
      allTransactions[receive._id] = {
        date: receive._id,
        saleCashAmount: 0,
        saleLendAmount: 0,
        buyCashAmount: 0,
        buyBorrowAmount: 0,
        receiveAmount: receive.receiveAmount || 0,
        payAmount: 0,
      };
    }
  });
  payTransactions.forEach((pay) => {
    if (allTransactions[pay._id]) {
      allTransactions[pay._id].payAmount = pay.payAmount || 0;
    } else {
      allTransactions[pay._id] = {
        date: pay._id,
        saleCashAmount: 0,
        saleLendAmount: 0,
        buyCashAmount: 0,
        buyBorrowAmount: 0,
        receiveAmount: 0,
        payAmount: pay.payAmount || 0,
      };
    }
  });

  const allTransactionsArray = Object.values(allTransactions);

  return {
    allTransactionsArray,
  };
});

export async function getAllTransferMoneySeller({ date = "", currency }) {
  const [startD, endD] = date?.split(",");
  const start = momentT(startD || new Date()).format("jYYYY/jMM/jDD");
  const end = momentT(endD || new Date()).format("jYYYY/jMM/jDD");

  const startDate = momentT
    .tz(start, "jYYYY/jMM/jDD", "Asia/Kabul")
    .startOf("day")
    .toDate();

  const endDate = momentT
    .tz(end, "jYYYY/jMM/jDD", "Asia/Kabul")
    .endOf("day")
    .toDate();

  const aggregateData = async (model, sumField, group) => {
    return model.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          ...(currency ? { "currency._id": currency.split("_")[1] } : {}),
        },
      },
      {
        $group: {
          _id: `$${group}`,
          pay: { $sum: `$${sumField}` },
        },
      },
    ]);
  };

  // اجرای کوئری‌ها به صورت موازی
  const [buy, pay] = await Promise.all([
    aggregateData(Buy, "cashAmount", "saller"), // خرید = پرداخت
    aggregateData(Pay, "amount", "type"), // دریافت وجه
  ]);
  const allData = [...buy, ...pay];

  // ترکیب نتایج برای هر فروشنده
  const combinedResults = allData.reduce((acc, curr) => {
    const saller = curr._id;

    if (!acc[saller]) {
      acc[saller] = { _id: saller, pay: 0, receive: 0 };
    }

    if (curr.pay) {
      acc[saller].pay += curr.pay;
    }

    return acc;
  }, {});
  let resultArray = Object.values(combinedResults);

  // استخراج تمام شناسه‌های منحصر به فرد
  const sallerIds = resultArray.map((item) => item._id);

  // دریافت اطلاعات حساب‌ها از کولکشن Account
  const accounts = await Account.find(
    { _id: { $in: sallerIds } },
    { name: 1, balance: 1, lend: 1 } // فقط فیلد name را دریافت می‌کنیم
  );

  // ایجاد مپ برای دسترسی سریع به نام‌ها
  const accountMap = new Map();
  accounts.forEach((account) => {
    accountMap.set(account._id?.toString(), {
      name: account.name,
      balance: account.balance,
      lend: account.lend,
    });
  });

  // اضافه کردن نام به هر آیتم
  resultArray = resultArray.map((item) => {
    const acc = accountMap.get(item._id?.toString());

    return {
      ...item,
      _id: item._id?.toString(),
      name: acc.name || "نامشخص",
      balance: acc.balance || 0,
      lend: acc.lend || 0,
    };
  });

  return resultArray;
}

export async function getAllTransferBank({ date = "", currency }) {
  const [startD, endD] = date?.split(",");
  const start = momentT(startD || new Date()).format("jYYYY/jMM/jDD");
  const end = momentT(endD || new Date()).format("jYYYY/jMM/jDD");

  const startDate = momentT
    .tz(start, "jYYYY/jMM/jDD", "Asia/Kabul")
    .startOf("day")
    .toDate();

  const endDate = momentT
    .tz(end, "jYYYY/jMM/jDD", "Asia/Kabul")
    .endOf("day")
    .toDate();

  try {
    // تابع کمکی برای اجرای aggregate
    const aggregateData = async (model, sumField, type) => {
      return model.aggregate([
        {
          $match: {
            date: { $gte: startDate, $lte: endDate },
            ...(currency ? { "currency._id": currency.split("_")[1] } : {}),
          },
        },
        {
          $group: {
            _id: "$income",
            [type]: { $sum: `$${sumField}` },
          },
        },
      ]);
    };

    const aggregateData2 = async (model, sumField, type) => {
      return model.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: "$from",
            [type]: { $sum: `$${sumField}` },
          },
        },
      ]);
    };

    const aggregateData3 = async (model, sumField, type) => {
      return model.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: "$to",
            [type]: { $sum: `$${sumField}` },
          },
        },
      ]);
    };

    // اجرای کوئری‌ها به صورت موازی
    const [
      buy,
      sale,
      receive,
      pay,
      cost,
      externalProceed,
      Transfer1,
      Transfer2,
    ] = await Promise.all([
      aggregateData(Buy, "cashAmount", "pay"), // خرید = پرداخت
      aggregateData(Sale, "cashAmount", "receive"), // فروش = دریافت
      aggregateData(Receive, "amount", "receive"), // دریافت وجه
      aggregateData(Pay, "amount", "pay"), // پرداخت وجه
      aggregateData(Cost, "amount", "pay"), // هزینه = پرداخت
      aggregateData(ExternalProceed, "amount", "receive"), // درآمد خارجی = دریافت
      aggregateData2(Transfer, "amount", "receive"), // درآمد خارجی = دریافت
      aggregateData3(Transfer, "amount", "pey"), // درآمد خارجی = دریافت
    ]);

    // ادغام تمام نتایج در یک آرایه
    const allData = [
      ...buy,
      ...sale,
      ...receive,
      ...pay,
      ...cost,
      ...externalProceed,
      ...Transfer1,
      ...Transfer2,
    ];

    // ترکیب نتایج برای هر فروشنده
    const combinedResults = allData.reduce((acc, curr) => {
      const saller = curr._id;

      if (!acc[saller]) {
        acc[saller] = { _id: saller, pay: 0, receive: 0 };
      }

      if (curr.pay) {
        acc[saller].pay += curr.pay;
      }

      if (curr.receive) {
        acc[saller].receive += curr.receive;
      }

      return acc;
    }, {});
    let resultArray = Object.values(combinedResults);

    // استخراج تمام شناسه‌های منحصر به فرد
    const sallerIds = resultArray.map((item) => item._id);

    // دریافت اطلاعات حساب‌ها از کولکشن Account
    const accounts = await Account.find(
      { _id: { $in: sallerIds } },
      { name: 1, balance: 1 } // فقط فیلد name را دریافت می‌کنیم
    );

    // ایجاد مپ برای دسترسی سریع به نام‌ها
    const accountMap = new Map();
    accounts.forEach((account) => {
      accountMap.set(account._id.toString(), {
        name: account.name,
        balance: account.balance,
      });
    });

    // اضافه کردن نام به هر آیتم
    resultArray = resultArray.map((item) => ({
      ...item,
      _id: item._id.toString(),
      name: accountMap.get(item._id.toString()).name || "نامشخص",
      balance: accountMap.get(item._id.toString()).balance || "نامشخص",
    }));

    // تبدیل به آرایه نهایی
    return resultArray;
  } catch (err) {
    console.log(err);
    return [];
  }
}
