import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import { Pay } from "@/models/pay";
import { Receive } from "@/models/receive";
import { Sale } from "@/models/Sale";
import { VendeeAccount } from "@/models/vendeeAccount";
import { VendeeReceive } from "@/models/vendeeReceive";
import { VendeeSale } from "@/models/vendeeSale";
import moment from "moment-jalaali";
import mongoose, { Mongoose } from "mongoose";

async function getAPIFeatures(query, queryString, type) {
  const count = await query.countDocuments({
    [type]: queryString?.saller || queryString?.buyer,
  });
  const features = new APIFeatures(query.find(), queryString)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return [result, count];
}

/////////////////////////////////////////  ACCOUNT ALL TRANSACTIONS ///////////////////////////
export const getaccountAlltransactions = catchAsync(async (filter, owner) => {
  const myFilter = {
    page: filter?.page || 0,
    limit: filter?.limit || 0,
    date: filter?.date || undefined,
  };
  const account = await VendeeAccount.findById(
    filter?.name?.split("_")?.[1] || ""
  );
  if (account.accountType === "buyer") {
    myFilter.buyer = filter?.name?.split("_")?.[1] || "";
  }

  const [sales, salesCount] = await getAPIFeatures(
    VendeeSale,
    myFilter,
    "buyer"
  );

  const [buys, buysCount] = await getAPIFeatures(Sale, myFilter, "company");
  const [receives, receivesCount] = await getAPIFeatures(
    VendeeReceive,
    myFilter,
    "buyer"
  );
  const [pays, paysCount] = await getAPIFeatures(Receive, myFilter, "company");

  const result = [...sales, ...buys, ...receives, ...pays]
    .map((transaction) => {
      if (transaction.constructor.modelName === "VendeeSale") {
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
      if (transaction.constructor.modelName === "VendeeReceive") {
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

/////////////////////////////////////////// GET METU LEGAR ///////////////////////////////

export const getMetuLedger = catchAsync(async ({ date }, owner) => {
  const month = moment(date || new Date()).format("jYYYY/jM");

  const saleTransactions = await VendeeSale.aggregate([
    {
      $match: {
        afgDate: `${month}`,
        owner: new mongoose.Types.ObjectId(owner),
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

  const buyTransactions = await Sale.aggregate([
    {
      $match: {
        afgDate: `${month}`,
        buyer: new mongoose.Types.ObjectId(owner),
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

//////////////////////////////////////////////////////  GET LEDGAR ////////////////////////////////////////////////////////

export const getLedgar = catchAsync(async ({ date }, owner) => {
  const month = moment(date).format("jYYYY/jM");

  const saleTransactions = await VendeeSale.aggregate([
    {
      $match: {
        afgDate: `${month}`,
        owner: new mongoose.Types.ObjectId(owner),
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

  const buyTransactions = await Sale.aggregate([
    {
      $match: {
        afgDate: `${month}`,
        buyer: new mongoose.Types.ObjectId(owner),
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

  const receiveTransactions = await VendeeReceive.aggregate([
    {
      $match: {
        afgDate: `${month}`,
        owner: new mongoose.Types.ObjectId(owner),
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

  const payTransactions = await Receive.aggregate([
    {
      $match: {
        afgDate: `${month}`,
        buyer: new mongoose.Types.ObjectId(owner),
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
