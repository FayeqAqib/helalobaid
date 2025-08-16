import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { VendeeAccount } from "@/models/vendeeAccount";
import { VendeeSale } from "@/models/vendeeSale";
import moment from "moment-jalaali";
import mongoose from "mongoose";

export const createSale = catchAsync(async (data, owner) => {
  const newData = { ...data, owner };
  const company = await Account.findById(owner, {
    balance: 1,
    vendeeBorrow: 1,
    METUbalance: 1,
  });
  const buyer = await VendeeAccount.findById(newData.buyer, {
    lend: 1,
  });
  if (company.METUbalance < newData.metuAmount)
    return {
      message: `برای پرداخت میتیو در حساب میتیو بیلانس کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
    };

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }
  const result = await VendeeSale.create(newData);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(newData.cashAmount),
      vendeeBorrow: Number(company.vendeeBorrow) + Number(newData.lendAmount),
      METUbalance: Number(company.METUbalance) - Number(newData.metuAmount),
    };
    await Account.findByIdAndUpdate(owner, newCompanyData);
    if (newData.lendAmount >= 1) {
      const newBuyerData = {
        lend: Number(buyer.lend) + Number(newData.lendAmount),
      };
      await VendeeAccount.findByIdAndUpdate(newData.buyer, newBuyerData);
    }
  }
  return result;
});
//

//

//

//

//

//

export const getAllSales = catchAsync(async (filter, owner) => {
  if (filter.buyer) {
    filter.buyer = filter.buyer.split("_")[1];
  }
  filter.owner = owner;

  const count = await VendeeSale.countDocuments(filter);

  const features = new APIFeatures(VendeeSale.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("buyer", "name");

  return { result, count };
});
//

//

//

//

//

//

export const deleteSale = catchAsync(async (data, owner) => {
  const company = await Account.findById(owner, {
    balance: 1,
    vendeeBorrow: 1,
    METUbalance: 1,
  });
  const buyer = await VendeeAccount.findById(data.buyer._id, {
    lend: 1,
  });

  if (company.balance < data.cashAmount)
    return {
      message: `برای پرداخت پول مشتری در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  const result = await VendeeSale.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.cashAmount),
      vendeeBorrow: Number(company.vendeeBorrow) - Number(data.lendAmount),
      METUbalance: Number(company.METUbalance) + Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(owner, newCompanyData);
    if (data.lendAmount >= 1) {
      const newBuyerData = {
        lend: Number(buyer.lend) - Number(data.lendAmount),
      };
      await VendeeAccount.findByIdAndUpdate(data.buyer, newBuyerData);
    }
  }
  return result;
});

//

//

//

/////////////////////////////////////////////////// update ///////////////////////////////////////////

//

//

//

export const updateSale = catchAsync(
  async ({ currentData, newData }, owner) => {
    const myNewData = { ...newData, image: currentData.image };
    const company = await Account.findById(owner, {
      balance: 1,

      vendeeBorrow: 1,
      METUbalance: 1,
    });

    if (company.METUbalance < myNewData.metuAmount - currentData.metuAmount)
      return {
        message: `برای پرداخت میتیو در حساب میتیو بیلانس کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
      };

    if (currentData.buyer !== myNewData.buyer) {
      const newBuyer = await VendeeAccount.findById(myNewData.buyer, {
        lend: 1,
        _id: 0,
      });
      const currentBuyer = await VendeeAccount.findById(currentData.buyer, {
        lend: 1,
        _id: 0,
      });
      currentBuyer.lend =
        Number(currentBuyer.lend) - Number(currentData.lendAmount);
      newBuyer.lend = Number(newBuyer.lend) + Number(myNewData.lendAmount);

      await VendeeAccount.findByIdAndUpdate(myNewData.buyer, newBuyer);
      await VendeeAccount.findByIdAndUpdate(currentData.buyer, currentBuyer);
    } else {
      const buyer = await VendeeAccount.findById(myNewData.buyer, {
        lend: 1,
        _id: 0,
      });
      buyer.lend =
        Number(buyer.lend) +
        (Number(myNewData.lendAmount) - Number(currentData.lendAmount));

      await VendeeAccount.findByIdAndUpdate(myNewData.buyer, buyer);
    }
    const result = await VendeeSale.findByIdAndUpdate(
      currentData._id,
      myNewData
    );

    if (result?._id) {
      const newCompanyData = {
        balance:
          Number(company.balance) -
          (Number(currentData.cashAmount) - Number(myNewData.cashAmount)),
        vendeeBorrow:
          Number(company.vendeeBorrow) -
          (Number(currentData.lendAmount) - Number(myNewData.lendAmount)),
        METUbalance:
          Number(company.METUbalance) +
          (Number(currentData.metuAmount) - Number(myNewData.metuAmount)),
      };

      await Account.findByIdAndUpdate(owner, newCompanyData);
    }
    return result;
  }
);

//
//
//

////////////////////////////////////////////////// aggregation ////////////////////////////////////////////////

export const getSixMonthSaleData = catchAsync(async (_, owner) => {
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

  const result = await VendeeSale.aggregate([
    {
      $match: { $or: filter, owner: new mongoose.Types.ObjectId(owner) },
    },
    {
      $group: {
        _id: "$afgDate",
        totalSale: { $sum: "$totalAmount" },
        totalMETU: { $sum: "$metuAmount" },
        count: { $sum: 1 },
        avgCent: { $avg: "$cent" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  return result;
});

// //////////////////////////////////////// BiggestSeller //////////////////////////////////
export const getBiggestSeller = catchAsync(async (_, owner) => {
  const result = await VendeeSale.aggregate([
    {
      $match: { owner: new mongoose.Types.ObjectId(owner) },
    },
    {
      $group: {
        _id: "$buyer",
        totalAmount: { $sum: "$totalAmount" },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
    {
      $limit: 5,
    },
    {
      $lookup: {
        from: "vendeeaccounts",
        localField: "_id",
        foreignField: "_id",
        as: "buyerInfo",
      },
    },
    {
      $unwind: "$buyerInfo",
    },
    {
      $project: {
        _id: 0,
        buyerName: "$buyerInfo.name",
        totalAmount: 1,
        count: 1,
      },
    },
  ]);

  return result;
});
