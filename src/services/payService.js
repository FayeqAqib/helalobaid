import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Pay } from "@/models/pay";

export const createPay = catchAsync(async (data) => {
  const newData = { ...data };
  const company = await Account.findById(newData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
  });

  const saller = await Account.findById(newData.type, {
    borrow: 1,
  });

  if (company.balance < newData.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  if (saller.borrow < newData.amount)
    return {
      message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${saller.borrow} می باشد`,
    };

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }
  const result = await Pay.create(newData);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(newData.amount),
    };
    const newCompany_idData = {
      lend: Number(company_id.lend) - Number(newData.amount),
    };
    await Account.findByIdAndUpdate(newData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (newData.amount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) - Number(newData.amount),
      };
      await Account.findByIdAndUpdate(newData.type, newSallerData);
    }
  }
  return result;
});

export const getAllPay = catchAsync(async (filter) => {
  if (filter.type) {
    filter.type = filter.type.split("_")[1];
  }
  const count = await Pay.countDocuments();
  const features = new APIFeatures(Pay.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["type", "income"], "name");

  return { result, count };
});

export const deletePay = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
  });
  const saller = await Account.findById(data.type, {
    borrow: 1,
  });

  const result = await Pay.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.amount),
    };
    const newCompany_idData = {
      lend: Number(company_id.lend) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(data.icome, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (data.amount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) + Number(data.amount),
      };
      await Account.findByIdAndUpdate(data.type, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updatePay = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData, image: currentData.image };
  const company = await Account.findById(currentData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
  });
  const newSaller = await Account.findById(myNewData.type, {
    borrow: 1,
    _id: 0,
  });

  if (newSaller.borrow < myNewData.amount - currentData.amount)
    return {
      message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${
        currentData.type === myNewData.type
          ? currentData.amount + newBuyer.borrow
          : newBuyer.borrow
      } می باشد`,
    };

  if (currentData.type !== myNewData.type) {
    const currentSaller = await Account.findById(currentData.type, {
      borrow: 1,
      _id: 0,
    });
    currentSaller.borrow =
      Number(currentSaller.borrow) + Number(currentData.amount);
    newSaller.borrow = Number(newSaller.borrow) - Number(myNewData.amount);

    await Account.findByIdAndUpdate(myNewData.type, newSaller);
    await Account.findByIdAndUpdate(currentData.type, currentSaller);
  } else {
    newSaller.borrow =
      Number(newSaller.borrow) -
      (Number(myNewData.amount) - Number(currentData.amount));
    await Account.findByIdAndUpdate(myNewData.type, newSaller);
  }

  const result = await Pay.findByIdAndUpdate(currentData._id, myNewData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) -
        (Number(myNewData.amount) - Number(currentData.amount)),
    };
    const newCompany_idData = {
      lend:
        Number(company_id.lend) -
        (Number(myNewData.amount) - Number(currentData.amount)),
    };
    await Account.findByIdAndUpdate(currentData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
  }
  return result;
});
