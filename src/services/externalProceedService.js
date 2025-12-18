import { catchAsync } from "@/lib/catchAsync";
import { ExternalProceed } from "@/models/externalProceed";
import { Account } from "@/models/account";
import APIFeatures from "@/lib/apiFeatues";
import { uploadImage } from "@/lib/uploadImage";
import { deleteFile } from "@/lib/deleteImage";
import { ProceedTital } from "@/models/ProceedTital";
import { Currency } from "@/models/Currency";

export const createExternalProceed = catchAsync(async (data) => {
  const newData = { ...data };
  const company = await Account.findById(newData.income, {
    balance: 1,
  });

  const currency = await Currency.findById(newData.currency);

  newData.amount = newData.amount * currency.rate;
  newData.currency = currency;

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  const result = await ExternalProceed.create(newData);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) + Number(newData.amount),
    };
    await Account.findByIdAndUpdate(newData.income, newBalance);
  }
  return result;
});

export const getAllExternalProceed = catchAsync(async (filter) => {
  if (filter.externalProceedTitle) {
    filter.externalProceedTitle = filter.externalProceedTitle.split("_")[1];
  }
  if (filter.income) {
    filter.income = filter.income.split("_")[1];
  }
  const count = await ExternalProceed.countDocuments();
  const features = new APIFeatures(ExternalProceed.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(
    ["income", "externalProceedTitle"],
    "name"
  );
  return { result, count };
});

export const deleteExternalProceed = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });
  if (company.balance < data.amount)
    return {
      message: `شما بیلانس کافی برای پرداخت ندارید بیلانس شما ${company.balance}  می باشد `,
    };

  const result = await ExternalProceed.findByIdAndDelete(data._id);
  await deleteFile(data.image);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) - Number(data.amount),
    };
    await Account.findByIdAndUpdate(data.income, newBalance);
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateExternalProceed = catchAsync(
  async ({ currentData, newData }) => {
    const myNewData = { ...newData };

    const currency = await Currency.findById(myNewData.currency);

    myNewData.amount = myNewData.amount * currency.rate;
    myNewData.currency = currency;

    if (typeof newData.image === "object") {
      const { path, err } = await uploadImage(data.image);
      myNewData.image = path;

      if (err) {
        return {
          message:
            "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
        };
      }
    } else {
      delete myNewData.image;
    }

    const company = await Account.findById(currentData.income, {
      balance: 1,
    });

    if (currentData.income !== newData.income) {
      const company_id = await Account.findById(currentData.income, {
        balance: 1,
      });

      const result = await ExternalProceed.findByIdAndUpdate(
        currentData._id,
        myNewData
      );

      if (result._id) {
        const currentCompanyBalance = {
          balance: Number(company_id.balance) - Number(currentData.amount),
        };
        const newCompanyBalance = {
          balance: Number(company.balance) + Number(myNewData.amount),
        };

        await Account.findByIdAndUpdate(
          currentData.income,
          currentCompanyBalance
        );
        await Account.findByIdAndUpdate(myNewData.income, newCompanyBalance);
      }

      return result;
    }

    const result = await ExternalProceed.findByIdAndUpdate(
      currentData._id,
      myNewData
    );
    if (result._id) {
      const newBalance = {
        balance:
          Number(company.balance) -
          (Number(currentData.amount) - Number(myNewData.amount)),
      };
      await Account.findByIdAndUpdate(currentData.income, newBalance);
    }
    return result;
  }
);

////////////////////////////////// GET PROCEED TITAL/////////////////////////////////////

export const getProceedTital = catchAsync(async () => {
  const accounts = await ProceedTital.find({}).lean(); // Get plain JavaScript objectsst;
  return accounts;
});
