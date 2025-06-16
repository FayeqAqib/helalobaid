import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Cost } from "@/models/cost";
import moment from "moment-jalaali";

export const createCost = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
  });
  if (company.balance <= 0)
    return { message: "به دلیل نبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  if (company.balance < data.amount)
    return { message: "به دلیل کمبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  const result = await Cost.create(data);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) - Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newBalance);
  }
  return result;
});

export const getAllCost = catchAsync(async (filter) => {
  const count = await Cost.countDocuments();
  const features = new APIFeatures(Cost.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});

export const deleteCost = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
  });

  const result = await Cost.findByIdAndDelete(data._id);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newBalance);
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateCost = catchAsync(async ({ currentData, newData }) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
  });
  if (company.balance <= 0)
    return { message: "به دلیل نبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  if (company.balance < newData.amount)
    return { message: "به دلیل کمبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
  const result = await Cost.findByIdAndUpdate(currentData._id, newData);
  if (result._id) {
    const newBalance = {
      balance:
        Number(company.balance) +
        (Number(currentData.amount) - Number(newData.amount)),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newBalance);
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
