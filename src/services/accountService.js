import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";

import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import { Sale } from "@/models/Sale";
import { Pay } from "@/models/pay";
import { Receive } from "@/models/receive";

export const createAccount = catchAsync(async (data) => {
  let company;
  if (data.borrow >= 1 || data.lend >= 1) {
    company = await Account.findById(process.env.COMPANY_ID, {
      borrow: 1,
      lend: 1,
    });
  }
  const result = await Account.create(data);

  if (data.borrow >= 1 || data.lend >= 1) {
    const newData = {
      lend: Number(company.lend) + Number(data.borrow),
      borrow: Number(company.borrow) + Number(data.lend),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newData);
  }
  return result;
});
//
//
//
//
//
//
//
//
//
//
//
//
export const getAllAccount = catchAsync(async (filter) => {
  if (filter.name) {
    filter.name = filter?.name?.length > 0 ? filter?.name?.split("_")?.[0] : "";
  }

  const count = await Account.countDocuments(filter);
  const features = new APIFeatures(Account.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;

  return { result, count };
});
//
//
//
//
//
//
//
//
//
//
//
//

export const deleteAccount = catchAsync(async (data) => {
  let company;

  const sale = await Sale.findById(data._id, { _id: 1 });
  const buy = await Buy.findById(data._id, { _id: 1 });
  const pay = await Pay.findById(data._id, { _id: 1 });
  const receive = await Receive.findById(data._id, { _id: 1 });

  if (sale || buy || pay || receive) {
    return {
      message:
        "حساب ذیل با شرکت معاملاتی انجام داده لذا حذف این حساب ممکن نیست",
    };
  }
  if (data.borrow >= 1 || data.lend >= 1) {
    company = await Account.findById(process.env.COMPANY_ID, {
      borrow: 1,
      lend: 1,
      balance: 1,
    });
    if (data.borrow > company.balance) {
      return {
        message: "برای پرداخت قرض این کاربر پول کافی ندارین",
      };
    }
  }

  if (data.borrow >= 1 || data.lend >= 1) {
    const newData = {
      lend: Number(company.lend) - Number(data.borrow),
      borrow: Number(company.borrow) - Number(data.lend),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newData);
  }

  const result = await Account.findByIdAndDelete(data._id);

  return result;
});

//
//
//
//
//
//
//
//
//
//
//
//

export const getAllSallerAndBuyer = catchAsync(
  async ({ type = "", lend = false, borrow = false }) => {
    const filter = {};
    if (type !== "") {
      filter.accountType = type?.split("-");
    }
    if (lend) {
      filter.lend = { $gt: 0 };
    }
    if (borrow) {
      filter.borrow = { $gt: 0 };
    }

    const result = await Account.find(filter, { name: 1, accountType: 1 });
    const newResult = result.map((item) => {
      return {
        label: item.name,
        value: item._id,
        accountType: item.accountType,
      };
    });

    return newResult;
  }
);

//
//
//
//
//
//
//
//
//
//
//
//

export const updateAccount = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
    lend: 1,
  });
  const user = await Account.findById(data._id, {
    borrow: 1,
    lend: 1,
  });

  if (data.borrow) {
    company.lend =
      Number(company.lend) - (Number(user.borrow) - Number(data.borrow));
    if (user.lend) {
      company.borrow = Number(company.borrow) - Number(user.lend);
    }
  }

  if (data.lend) {
    company.borrow =
      Number(company.borrow) - (Number(user.lend) - Number(data.lend));
    if (user.borrow) {
      company.lend = Number(company.lend) - Number(user.borrow);
    }
  }

  const result = await Account.findByIdAndUpdate(data._id, data);

  if (result._id) {
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, company);
  }

  return result;
});

export const getTopThreeAccountsBylend = catchAsync(async () => {
  const accounts = await Account.find(
    { accountType: "buyer", lend: { $ne: 0 } },
    { lend: 1, name: 1 }
  )
    .sort({ lend: -1 }) // Sort in descending order by balance
    .limit(10) // Limit the result to the top 3
    .lean(); // Get plain JavaScript objects

  return accounts;
});

export const getCompanyAccount = catchAsync(async () => {
  const accounts = await Account.find({ accountType: "company" }).lean(); // Get plain JavaScript objects

  return accounts;
});
