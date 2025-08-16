import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import moment from "moment-jalaali";

import { uploadImage } from "@/lib/uploadImage";
import { deleteFile } from "@/lib/deleteImage";

////////////////////////////////////////////////// create ////////////////////////////////////////////////

export const createBuy = catchAsync(async (data) => {
  const newData = { ...data };
  const company = await Account.findById(newData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
    METUbalance: 1,
  });
  const saller = await Account.findById(newData.saller, {
    borrow: 1,
    METUbalance: 1,
  });

  if (company.balance < newData.cashAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  const result = await Buy.create(newData);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(newData.cashAmount),
    };
    const newCompany_idData = {
      lend: Number(company_id.lend) + Number(newData.borrowAmount),
      METUbalance: Number(company_id.METUbalance) + Number(newData.metuAmount),
    };
    await Account.findByIdAndUpdate(newData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (newData.borrowAmount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) + Number(newData.borrowAmount),
      };
      await Account.findByIdAndUpdate(newData.saller, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllbuy = catchAsync(async (filter) => {
  if (filter.saller) {
    filter.saller = filter.saller.split("_")[1];
  }
  const count = await Buy.countDocuments();
  const features = new APIFeatures(Buy.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["saller", "income"], "name");
  return { result, count };
});

////////////////////////////////////////////////// delete ////////////////////////////////////////////////

export const deleteBuy = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
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
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.cashAmount),
    };
    const newCompany_idData = {
      lend: Number(company_id.lend) - Number(data.borrowAmount),
      METUbalance: Number(company_id.METUbalance) - Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(data.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
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
  const myNewData = { ...newData, image: currentData.image };

  const company = await Account.findById(myNewData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
    METUbalance: 1,
  });

  if (company.balance < myNewData.cashAmount - currentData.cashAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  // let newSaller;
  // let currentSaller;

  if (currentData.saller !== myNewData.saller) {
    const newSaller = await Account.findById(myNewData.saller, {
      borrow: 1,
      _id: 0,
    });
    const currentSaller = await Account.findById(currentData.saller, {
      borrow: 1,
      _id: 0,
    });
    currentSaller.borrow =
      Number(currentSaller.borrow) - Number(currentData.borrowAmount);
    newSaller.borrow =
      Number(newSaller.borrow) + Number(myNewData.borrowAmount);

    await Account.findByIdAndUpdate(myNewData.saller, newSaller);
    await Account.findByIdAndUpdate(currentData.saller, currentSaller);
  } else {
    const saller = await Account.findById(myNewData.saller, {
      borrow: 1,
      _id: 0,
    });
    saller.borrow =
      Number(saller.borrow) -
      (Number(currentData.borrowAmount) - Number(myNewData.borrowAmount));
    await Account.findByIdAndUpdate(myNewData.saller, saller);
  }

  const result = await Buy.findByIdAndUpdate(currentData._id, myNewData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        (Number(currentData.cashAmount) - Number(myNewData.cashAmount)),
    };
    const newCompany_idData = {
      lend:
        Number(company_id.lend) -
        (Number(currentData.borrowAmount) - Number(myNewData.borrowAmount)),
      METUbalance:
        Number(company_id.METUbalance) -
        (Number(currentData.metuAmount) - Number(myNewData.metuAmount)),
    };
    await Account.findByIdAndUpdate(myNewData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
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
