import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Sale } from "@/models/Sale";
import moment from "moment-jalaali";
import mongoose from "mongoose";

export const getAllBuyes = catchAsync(async (filter, owner) => {
  filter.buyer = owner;

  const count = await Sale.countDocuments(filter);

  const features = new APIFeatures(Sale.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("buyer", "name");

  return { result, count };
});

/////////////////////////////////////////// SEX MONTH BUY DATA ///////////////////////////////////////////

export const getSixMonthBuyData = catchAsync(async (_, owner) => {
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

  const result = await Sale.aggregate([
    {
      $match: { $or: filter, buyer: new mongoose.Types.ObjectId(owner) },
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
