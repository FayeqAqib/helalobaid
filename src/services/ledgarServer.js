import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import { Cost } from "@/models/cost";
import { ExternalProceed } from "@/models/externalProceed";
import { Pay } from "@/models/pay";
import { Receive } from "@/models/receive";
import { Sale } from "@/models/Sale";
import moment from "moment-jalaali";

async function getAPIFeatures(query, queryString) {
  const count = await query.countDocuments();
  const features = new APIFeatures(query.find(), queryString)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;

  return [result, count];
}

export const getaccountAlltransactions = catchAsync(async (filter) => {
  const myFilter = {
    page: filter?.page || 0,
    limit: filter?.limit || 0,
    date: filter?.date || undefined,
  };

  const account = await Account.findById(filter?.name?.split("_")?.[1] || "");

  if (account.accountType === "buyer") {
    myFilter.buyer = filter?.name?.split("_")?.[1] || "";
  }

  if (account.accountType === "saller") {
    myFilter.saller = filter?.name?.split("_")?.[1] || "";
  }
  const { buyer, saller, ...newFilter } = myFilter;
  if (account.accountType === "saller" || account.accountType === "buyr") {
    newFilter.type = filter?.name?.split("_")?.[1];
  }
  if (account.accountType === "bank" || account.accountType === "company") {
    newFilter.income = filter?.name?.split("_")?.[1];
    myFilter.income = filter?.name?.split("_")?.[1] || "";
  }

  const [sales, salesCount] = await getAPIFeatures(Sale, myFilter, "buyer");
  const [buys, buysCount] = await getAPIFeatures(Buy, myFilter, "saller");
  const [receives, receivesCount] = await getAPIFeatures(
    Receive,
    newFilter,
    "type"
  );
  const [pays, paysCount] = await getAPIFeatures(Pay, newFilter, "type");

  const result = [...sales, ...buys, ...receives, ...pays]
    .map((transaction) => {
      if (transaction.constructor.modelName === "Sale") {
        return {
          ...transaction.toObject(),
          saleCashAmount: transaction.cashAmount,
        };
      }
      if (transaction.constructor.modelName === "Buy") {
        return {
          ...transaction.toObject(),
          buyCashAmount: transaction.cashAmount,
        };
      }
      if (transaction.constructor.modelName === "Receive") {
        return { ...transaction.toObject(), receiveAmount: transaction.amount };
      }
      if (transaction.constructor.modelName === "Pay") {
        return { ...transaction.toObject(), payAmount: transaction.amount };
      }
      return transaction;
    })
    .sort((a, b) => b.date - a.date);
  const count = salesCount + buysCount + receivesCount + paysCount;

  return {
    result,
    account,
    count,
  };
});

export const getMetuLedger = catchAsync(async ({ date }) => {
  const month = moment(date || new Date()).format("jYYYY/jM");
  const saleTransactions = await Sale.aggregate([
    {
      $match: {
        afgDate: `${month}`,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        saleMetuAmount: { $sum: "$metuAmount" },
        count: { $sum: 1 },
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
        afgDate: `${month}`,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        buyMetuAmount: { $sum: "$metuAmount" },
        count: { $sum: 1 },
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
      saleMetuAmount: sale.saleMetuAmount || 0,
      buyMetuAmount: 0,
    };
  });

  buyTransactions.forEach((buy) => {
    if (allTransactions[buy._id]) {
      allTransactions[buy._id].buyMetuAmount = buy.buyMetuAmount || 0;
    } else {
      allTransactions[buy._id] = {
        date: buy._id,
        saleMetuAmount: 0,
        buyMetuAmount: buy.buyMetuAmount || 0,
      };
    }
  });

  const allTransactionsArray = Object.values(allTransactions);

  return {
    allTransactionsArray,
  };
});

export const getLedgar = catchAsync(async ({ date }) => {
  const month = moment(date).format("jYYYY/jM");

  const saleTransactions = await Sale.aggregate([
    {
      $match: {
        afgDate: `${month}`,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        saleCashAmount: { $sum: "$cashAmount" },
        saleLendAmount: { $sum: "$lendAmount" },
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
        afgDate: `${month}`,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        buyCashAmount: { $sum: "$cashAmount" },
        buyBorrowAmount: { $sum: "$borrowAmount" },
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
        afgDate: `${month}`,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        receiveAmount: { $sum: "$amount" },
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
        afgDate: `${month}`,
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" },
        },
        payAmount: { $sum: "$amount" },
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
export async function getAllTransferMoneySeller() {
  const month = moment(new Date()).format("jYYYY/jM");

  const aggregateData = async (model, sumField, group) => {
    return model.aggregate([
      { $match: { afgDate: month } },
      {
        $group: {
          _id: `$${group}`,
          pay: { $sum: `$${sumField}` },
        },
      },
    ]);
  };

  // اجرای کوئری‌ها به صورت موازی
  const [buy, receive] = await Promise.all([
    aggregateData(Buy, "cashAmount", "saller"), // خرید = پرداخت
    aggregateData(Receive, "amount", "type"), // دریافت وجه
  ]);
  const allData = [...buy, ...receive];

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

export async function getAllTransferBank() {
  const month = moment(new Date()).format("jYYYY/jM");

  // تابع کمکی برای اجرای aggregate
  const aggregateData = async (model, sumField, type) => {
    return model.aggregate([
      { $match: { afgDate: month } },
      {
        $group: {
          _id: "$income",
          [type]: { $sum: `$${sumField}` },
        },
      },
    ]);
  };

  // اجرای کوئری‌ها به صورت موازی
  const [buy, sale, receive, pay, cost, externalProceed] = await Promise.all([
    aggregateData(Buy, "cashAmount", "pay"), // خرید = پرداخت
    aggregateData(Sale, "cashAmount", "receive"), // فروش = دریافت
    aggregateData(Receive, "amount", "receive"), // دریافت وجه
    aggregateData(Pay, "amount", "pay"), // پرداخت وجه
    aggregateData(Cost, "amount", "pay"), // هزینه = پرداخت
    aggregateData(ExternalProceed, "amount", "receive"), // درآمد خارجی = دریافت
  ]);

  // ادغام تمام نتایج در یک آرایه
  const allData = [
    ...buy,
    ...sale,
    ...receive,
    ...pay,
    ...cost,
    ...externalProceed,
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
}
