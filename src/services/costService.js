import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { CostTital } from "@/models/constTital";
import { Cost } from "@/models/cost";
import moment from "moment-jalaali";

export const createCost = catchAsync(async (data) => {
  const newData = { ...data };
  const company = await Account.findById(newData.income, {
    balance: 1,
  });
  if (company.balance <= 0)
    return { message: "به دلیل نبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  if (company.balance < newData.amount)
    return { message: "به دلیل کمبود پول نقد در حساب شرکت پرداخت ممکن نیست" };

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }
  const result = await Cost.create(newData);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) - Number(newData.amount),
    };
    await Account.findByIdAndUpdate(newData.income, newBalance);
  }
  return result;
});

export const getAllCost = catchAsync(async (filter) => {
  const count = await Cost.countDocuments();
  const features = new APIFeatures(Cost.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["income", "costTital"], "name");
  return { result, count };
});

export const deleteCost = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });

  const result = await Cost.findByIdAndDelete(data._id);
  await deleteFile(data.image);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(data.income, newBalance);
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateCost = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData };

  if (typeof newData.image === "object") {
    const { path, err } = await uploadImage(myNewData.image);
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

  const company = await Account.findById(newData.income, {
    balance: 1,
  });

  if (currentData.income !== newData.income) {
    const company_id = await Account.findById(currentData.income, {
      balance: 1,
    });

    const result = await Cost.findByIdAndUpdate(currentData._id, myNewData);
    if (result._id) {
      const currentCompanyBalance = {
        balance: Number(company_id.balance) + Number(currentData.amount),
      };
      const newCompanyBalance = {
        balance: Number(company.balance) - Number(myNewData.amount),
      };
      await Account.findByIdAndUpdate(
        currentData.income,
        currentCompanyBalance
      );
      await Account.findByIdAndUpdate(myNewData.income, newCompanyBalance);
    }

    return result;
  }

  if (company.balance <= 0)
    return { message: "به دلیل نبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  if (company.balance < myNewData.amount - currentData.amount)
    return { message: "به دلیل کمبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  const result = await Cost.findByIdAndUpdate(currentData._id, myNewData);
  if (result._id) {
    const newBalance = {
      balance:
        Number(company.balance) +
        (Number(currentData.amount) - Number(myNewData.amount)),
    };
    await Account.findByIdAndUpdate(myNewData.income, newBalance);
  }
  return result;
});

////////////////////////////////////////////////// getCostInThisMonth ////////////////////////////////////////////////

export const getCostInThisMonth = catchAsync(async () => {
  const thisMonth = moment().format("jYYYY/jM"); // مثلاً "1403/3"

  const result = await Cost.aggregate([
    {
      $match: {
        afgDate: { $regex: `^${thisMonth}` }, // مثل "1403/3/..." همه‌ی روزهای این ماه
      },
    },
    {
      $group: {
        _id: "$costTitle",
        totalCost: { $sum: "$amount" },
        numCosts: { $sum: 1 },
      },
    },
  ]);
  return result;
});

////////////////////////////////// GET COST TITAL/////////////////////////////////////

export const getCostTital = catchAsync(async () => {
  const accounts = await CostTital.find({}).lean(); // Get plain JavaScript objects

  return accounts;
});
