import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import { Pay } from "@/models/pay";
import { Receive } from "@/models/receive";
import { Sale } from "@/models/Sale";
import moment from "moment-jalaali";

export const getaccountAlltransactions = catchAsync(async ({ _id, filter }) => {
  const { limit, page } = filter;
  const account = await Account.findById(_id, {
    name: 1,
    accountType: 1,
    _id: 0,
  });
  const [
    sales,
    buys,
    receives,
    pays,
    salesCount,
    buysCount,
    receivesCount,
    paysCount,
  ] = await Promise.all([
    Sale.find({ buyer: _id })
      .limit(limit)
      .skip(page * limit),
    Buy.find({ saller: _id })
      .limit(limit)
      .skip(page * limit),
    Receive.find({ buyer: _id })
      .limit(limit)
      .skip(page * limit),
    Pay.find({ saller: _id })
      .limit(limit)
      .skip(page * limit),
    Sale.countDocuments({ buyer: _id }),
    Buy.countDocuments({ saller: _id }),
    Receive.countDocuments({ buyer: _id }),
    Pay.countDocuments({ saller: _id }),
  ]);

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
    account: { name: account.name, accountType: account.accountType },
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
  console.log(month, "sadasdsadsad");
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
