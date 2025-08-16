import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { VendeeCost } from "@/models/vendeeCost";
import moment from "moment-jalaali";
import mongoose from "mongoose";

export const createCost = catchAsync(async (data, owner) => {
  const newData = { ...data, owner };
  const company = await Account.findById(owner, {
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
  const result = await VendeeCost.create(newData);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) - Number(newData.amount),
    };
    await Account.findByIdAndUpdate(owner, newBalance);
  }
  return result;
});

/////////////////////////////////////////////////// GET ALL COST ////////////////////////////////////

export const getAllCost = catchAsync(async (filter, owner) => {
  filter.owner = owner;
  const count = await VendeeCost.countDocuments();
  const features = new APIFeatures(VendeeCost.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;

  return { result, count };
});

////////////////////////////////////////////DELETE COST ////////////////////////////////

export const deleteCost = catchAsync(async (data, owner) => {
  const company = await Account.findById(owner, {
    balance: 1,
  });

  const result = await VendeeCost.findByIdAndDelete(data._id);
  await deleteFile(data.image);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(owner, newBalance);
  }
  return result;
});

///////////////////////////////////// UPDATE COST /////////////////////////////////

export const updateCost = catchAsync(
  async ({ currentData, newData }, owner) => {
    const myNewData = { ...newData, image: currentData.image };

    const company = await Account.findById(owner, {
      balance: 1,
    });
    if (company.balance <= 0)
      return { message: "به دلیل نبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
    if (company.balance < myNewData.amount)
      return { message: "به دلیل کمبود پول نقد در حساب شرکت پرداخت ممکن نیست" };
    const result = await VendeeCost.findByIdAndUpdate(
      currentData._id,
      myNewData
    );
    if (result._id) {
      const newBalance = {
        balance:
          Number(company.balance) +
          (Number(currentData.amount) - Number(myNewData.amount)),
      };
      await Account.findByIdAndUpdate(owner, newBalance);
    }
    return result;
  }
);

////////////////////////////////////////////////// THIS MONTH COST ////////////////////////////////////////////////

export const getCostInThisMonth = catchAsync(async (_, owner) => {
  const thisMonth = moment().format("jYYYY/jM"); // مثلاً "1403/3"

  const result = await VendeeCost.aggregate([
    {
      $match: {
        afgDate: { $regex: `^${thisMonth}` },
        owner: new mongoose.Types.ObjectId(owner), // مثل "1403/3/..." همه‌ی روزهای این ماه
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
