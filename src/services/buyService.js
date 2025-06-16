import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import moment from "moment-jalaali";

////////////////////////////////////////////////// create ////////////////////////////////////////////////

export const createBuy = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    lend: 1,
    METUbalance: 1,
  });
  const saller = await Account.findById(data.saller, {
    borrow: 1,
  });

  if (company.balance < data.cashAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  const result = await Buy.create(data);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.cashAmount),
      lend: Number(company.lend) + Number(data.borrowAmount),
      METUbalance: Number(company.METUbalance) + Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.borrowAmount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) + Number(data.borrowAmount),
      };
      await Account.findByIdAndUpdate(data.saller, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllbuy = catchAsync(async (filter) => {
  if (filter.saller) {
    filter.saller = await Account.findOne({ name: filter.saller }, { _id: 1 });
  }
  const count = await Buy.countDocuments();
  const features = new APIFeatures(Buy.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("saller", "name");
  return { result, count };
});

////////////////////////////////////////////////// delete ////////////////////////////////////////////////

export const deleteBuy = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    lend: 1,
    METUbalance: 1,
  });

  const saller = await Account.findById(data.saller._id, {
    borrow: 1,
  });

  if (company.METUbalance < data.metuAmount)
    return {
      message: `برای پرداخت  در حساب خود میتیو کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
    };
  const result = await Buy.findByIdAndDelete(data._id);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.cashAmount),
      lend: Number(company.lend) - Number(data.borrowAmount),
      METUbalance: Number(company.METUbalance) - Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.borrowAmount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) - Number(data.borrowAmount),
      };
      await Account.findByIdAndUpdate(data.saller, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateBuy = catchAsync(async ({ currentData, newData }) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    lend: 1,
    METUbalance: 1,
  });

  if (company.balance < newData.cashAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  // let newSaller;
  // let currentSaller;

  if (currentData.saller !== newData.saller) {
    const newSaller = await Account.findById(newData.saller, {
      borrow: 1,
      _id: 0,
    });
    const currentSaller = await Account.findById(currentData.saller, {
      borrow: 1,
      _id: 0,
    });
    currentSaller.borrow =
      Number(currentSaller.borrow) - Number(currentData.borrowAmount);
    newSaller.borrow = Number(newSaller.borrow) + Number(newData.borrowAmount);

    await Account.findByIdAndUpdate(newData.saller, newSaller);
    await Account.findByIdAndUpdate(currentData.saller, currentSaller);
  } else {
    const saller = await Account.findById(newData.saller, {
      borrow: 1,
      _id: 0,
    });
    saller.borrow = Number(newData.borrowAmount);

    await Account.findByIdAndUpdate(newData.saller, saller);
  }

  const result = await Buy.findByIdAndUpdate(currentData._id, newData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        (Number(currentData.cashAmount) - Number(newData.cashAmount)),
      lend:
        Number(company.lend) -
        (Number(currentData.borrowAmount) - Number(newData.borrowAmount)),
      METUbalance:
        Number(company.METUbalance) -
        (Number(currentData.metuAmount) - Number(newData.metuAmount)),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
  }
  return result;
});

////////////////////////////////////////////////// aggregation ////////////////////////////////////////////////

export const getSixMonthBuyData = catchAsync(async () => {
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

  const result = await Buy.aggregate([
    {
      $match: { $or: filter },
    },
    {
      $group: {
        _id: "$afgDate",
        totalBuy: { $sum: "$totalAmount" },
        totalMETU: { $sum: "$metuAmount" },
        avgCent: { $avg: "$cent" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return result;
});
