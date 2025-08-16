import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";

import { VendeeAccount } from "@/models/vendeeAccount";
import { VendeeReceive } from "@/models/vendeeReceive";
import { VendeeSale } from "@/models/vendeeSale";

export const createAccount = catchAsync(async (data, owner) => {
  let company;
  if (data.borrow >= 1 || data.lend >= 1) {
    company = await Account.findById(owner, {
      vendeeBorrow: 1,
      vendeeLend: 1,
    });
  }

  const result = await VendeeAccount.create({ ...data, owner });

  if (data.borrow >= 1 || data.lend >= 1) {
    const newData = {
      vendeeLend: Number(company.vendeeBorrow) + Number(data.borrow),
      vendeeBorrow: Number(company.vendeeBorrow) + Number(data.lend),
    };
    await Account.findByIdAndUpdate(owner, newData);
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

export const getAllAccount = catchAsync(async (filter, owner) => {
  if (filter.name) {
    filter.name = filter?.name?.length > 0 ? filter?.name?.split("_")?.[0] : "";
  }
  filter.owner = owner;

  const count = await VendeeAccount.countDocuments(filter);
  const features = new APIFeatures(VendeeAccount.find(), filter)
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
export const deleteAccount = catchAsync(async (data, owner) => {
  let company;
  const account = [];

  const sale = await VendeeSale.find(
    { _id: data._id, owner: owner },
    { _id: 1 }
  );

  const receive = await VendeeReceive.find(
    { _id: data._id, owner: owner },
    { _id: 1 }
  );

  if (sale.length > 0 || receive.length > 0) {
    return {
      message:
        "حساب ذیل با شرکت معاملاتی انجام داده لذا حذف این حساب ممکن نیست",
    };
  }

  if (data.borrow >= 1 || data.lend >= 1) {
    company = await Account.findById(owner, {
      vendeeBorrow: 1,
      vendeeLend: 1,
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
      vendeeLend: Number(company.vendeeLend) - Number(data.borrow),
      vendeeBorrow: Number(company.vendeeBorrow) - Number(data.lend),
    };
    await Account.findByIdAndUpdate(owner, newData);
  }

  const result = await VendeeAccount.findByIdAndDelete(data._id);
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

export const getAllBuyer = catchAsync(
  async ({ type = "", lend = false, borrow = false }, owner) => {
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

    filter.owner = owner;

    const result = await VendeeAccount.find(filter, {
      name: 1,
      accountType: 1,
    });

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
//
//

export const updateAccount = catchAsync(async (data, owner) => {
  const company = await Account.findById(owner, {
    vendeeBorrow: 1,
    vendeeLend: 1,
  });
  const user = await VendeeAccount.findById(data._id, {
    borrow: 1,
    lend: 1,
  });

  if (data.borrow) {
    company.vendeeLend =
      Number(company.vendeeLend) - (Number(user.borrow) - Number(data.borrow));
    if (user.lend) {
      company.vendeeBorrow = Number(company.vendeeBorrow) - Number(user.lend);
    }
  }

  if (data.lend) {
    company.vendeeBorrow =
      Number(company.vendeeBorrow) - (Number(user.lend) - Number(data.lend));
    if (user.borrow) {
      company.vendeeLend = Number(company.vendeeLend) - Number(user.borrow);
    }
  }

  const result = await VendeeAccount.findByIdAndUpdate(data._id, {
    ...data,
    owner,
  });

  if (result._id) {
    await Account.findByIdAndUpdate(owner, company);
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
export const getTopThreeAccountsBylend = catchAsync(async (_, owner) => {
  const accounts = await VendeeAccount.find(
    { accountType: "buyer", lend: { $ne: 0 }, owner },
    { lend: 1, name: 1 }
  )
    .sort({ lend: -1 }) // Sort in descending order by balance
    .limit(3) // Limit the result to the top 3
    .lean(); // Get plain JavaScript objects

  return accounts;
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
//

export const getCompanyAccount = catchAsync(async (_, owner) => {
  const accounts = await Account.findById(owner).lean(); // Get plain JavaScript objects

  return accounts;
});
