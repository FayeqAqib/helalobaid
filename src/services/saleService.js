import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Sale } from "@/models/Sale";
import moment from "moment-jalaali";

export const createSale = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    borrow: 1,
    METUbalance: 1,
  });
  const buyer = await Account.findById(data.buyer, {
    lend: 1,
  });
  if (company.METUbalance < data.metuAmount)
    return {
      message: `برای پرداخت میتیو در حساب میتیو بیلانس کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
    };
  const result = await Sale.create(data);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.cashAmount),
      borrow: Number(company.borrow) + Number(data.lendAmount),
      METUbalance: Number(company.METUbalance) - Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.lendAmount >= 1) {
      const newBuyerData = {
        lend: Number(buyer.lend) + Number(data.lendAmount),
      };
      const x = await Account.findByIdAndUpdate(data.buyer, newBuyerData);
    }
  }
  return result;
});

//

//

//

//

//

//

export const getAllSales = catchAsync(async (filter) => {
  if (filter.buyer) {
    filter.buyer = await Account.findOne({ name: filter.buyer }, { _id: 1 });
  }

  const count = await Sale.countDocuments();
  console.log(filter);
  const features = new APIFeatures(Sale.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("buyer", "name");

  return { result, count };
});
//

//

//

//

//

//

export const deleteSale = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    borrow: 1,
    METUbalance: 1,
  });
  const buyer = await Account.findById(data.buyer._id, {
    lend: 1,
  });

  if (company.balance < data.cashAmount)
    return {
      message: `برای پرداخت پول مشتری در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  const result = await Sale.findByIdAndDelete(data._id);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.cashAmount),
      borrow: Number(company.borrow) - Number(data.lendAmount),
      METUbalance: Number(company.METUbalance) + Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.lendAmount >= 1) {
      const newBuyerData = {
        lend: Number(buyer.lend) - Number(data.lendAmount),
      };
      await Account.findByIdAndUpdate(data.buyer, newBuyerData);
    }
  }
  return result;
});

//

//

//

/////////////////////////////////////////////////// update ///////////////////////////////////////////

//

//

//

export const updateSale = catchAsync(async ({ currentData, newData }) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    lend: 1,
    METUbalance: 1,
  });

  if (company.METUbalance < newData.metuAmount)
    return {
      message: `برای پرداخت میتیو در حساب میتیو بیلانس کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
    };

  if (currentData.buyer !== newData.buyer) {
    const newBuyer = await Account.findById(newData.buyer, {
      lend: 1,
      _id: 0,
    });
    const currentBuyer = await Account.findById(currentData.buyer, {
      lend: 1,
      _id: 0,
    });
    currentBuyer.lend =
      Number(currentBuyer.lend) - Number(currentData.lendAmount);
    newBuyer.lend = Number(newBuyer.lend) + Number(newData.lendAmount);

    await Account.findByIdAndUpdate(newData.buyer, newBuyer);
    await Account.findByIdAndUpdate(currentData.buyer, currentBuyer);
  } else {
    const buyer = await Account.findById(newData.buyer, {
      lend: 1,
      _id: 0,
    });
    buyer.lend = Number(newData.lendAmount);

    await Account.findByIdAndUpdate(newData.buyer, buyer);
  }
  const result = await Sale.findByIdAndUpdate(currentData._id, newData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) -
        (Number(currentData.cashAmount) - Number(newData.cashAmount)),
      borrow:
        Number(company.lend) -
        (Number(currentData.lendAmount) - Number(newData.lendAmount)),
      METUbalance:
        Number(company.METUbalance) +
        (Number(currentData.metuAmount) - Number(newData.metuAmount)),
    };

    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
  }
  return result;
});

////////////////////////////////////////////////// aggregation ////////////////////////////////////////////////

export const getSixMonthSaleData = catchAsync(async () => {
  const thisMonth = moment().format("jYYYY/jM").split("/"); // مثلاً "1403/3"

  const startNumber = Number(thisMonth.at(1));
  const filter = [];
  for (let i = 0; i < 6; i++) {
    const month =
      startNumber - i > 0 ? startNumber - i : 12 + (startNumber - i);
    const year = startNumber - i > 0 ? thisMonth[0] : Number(thisMonth[0]) - 1;
    filter.push({
      afgDate: moment(`${year}/${month}`, "jYYYY/jM").format("jYYYY/jM"),
    });
  }

  const result = await Sale.aggregate([
    {
      $match: { $or: filter },
    },
    {
      $group: {
        _id: "$afgDate",
        totalSale: { $sum: "$totalAmount" },
        totalMETU: { $sum: "$metuAmount" },
        count: { $sum: 1 },
        avgCent: { $avg: "$cent" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return result;
});

export const getBiggestSeller = catchAsync(async () => {
  const result = await Sale.aggregate([
    {
      $group: {
        _id: "$buyer",
        totalAmount: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
    {
      $limit: 3,
    },
    {
      $lookup: {
        from: "accounts",
        localField: "_id",
        foreignField: "_id",
        as: "buyerInfo",
      },
    },
    {
      $unwind: "$buyerInfo",
    },
    {
      $project: {
        _id: 0,
        buyerName: "$buyerInfo.name",
        totalAmount: 1,
        count: 1,
      },
    },
  ]);

  return result;
});
