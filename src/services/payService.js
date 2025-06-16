import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Pay } from "@/models/pay";

export const createPay = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
    balance: 1,
  });
  const saller = await Account.findById(data.saller, {
    borrow: 1,
  });
  if (company.balance < data.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  if (saller.borrow < data.amount)
    return {
      message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${saller.borrow} می باشد`,
    };
  const result = await Pay.create(data);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.amount),
      lend: Number(company.lend) - Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.amount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) - Number(data.amount),
      };
      await Account.findByIdAndUpdate(data.saller, newSallerData);
    }
  }
  return result;
});

export const getAllPay = catchAsync(async (filter) => {
  if (filter.saller) {
    filter.saller = await Account.findOne({ name: filter.saller }, { _id: 1 });
  }
  const count = await Pay.countDocuments();
  const features = new APIFeatures(Pay.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("saller", "name");

  return { result, count };
});

export const deletePay = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
    balance: 1,
  });
  const saller = await Account.findById(data.saller, {
    borrow: 1,
  });

  const result = await Pay.findByIdAndDelete(data._id);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.amount),
      lend: Number(company.lend) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.amount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) + Number(data.amount),
      };
      await Account.findByIdAndUpdate(data.saller, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updatePay = catchAsync(async ({ currentData, newData }) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
    balance: 1,
  });
  const newSaller = await Account.findById(newData.saller, {
    borrow: 1,
    _id: 0,
  });

  if (newSaller.borrow < newData.amount)
    return {
      message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${newSaller.borrow} می باشد`,
    };

  if (currentData.saller !== newData.saller) {
    const currentSaller = await Account.findById(currentData.saller, {
      borrow: 1,
      _id: 0,
    });
    currentSaller.borrow =
      Number(currentSaller.borrow) + Number(currentData.amount);
    newSaller.borrow = Number(newSaller.borrow) - Number(newData.amount);

    await Account.findByIdAndUpdate(newData.saller, newSaller);
    await Account.findByIdAndUpdate(currentData.saller, currentSaller);
  } else {
    newSaller.borrow = Number(newData.amount);
    await Account.findByIdAndUpdate(newData.saller, newSaller);
  }

  const result = await Pay.findByIdAndUpdate(currentData._id, newData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        (Number(currentData.amount) - Number(newData.amount)),
      lend:
        Number(company.lend) -
        (Number(currentData.amount) - Number(newData.amount)),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
  }
  return result;
});
