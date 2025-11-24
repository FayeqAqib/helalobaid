import APIFeatures from "@/lib/apiFeatues";
import { generateBillNumber } from "@/lib/billNumberGenerator";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Items } from "@/models/items";
import { Sale } from "@/models/Sale";
import moment from "moment-jalaali";

export const createSale = catchAsync(async (data) => {
  const newData = { ...data };

  //////////////////////////////// GENERATE BILL //////////////////////////////////

  newData.billNumber = await generateBillNumber(Sale);

  /////////////////////////////////////////////////////// UPLOAD IMAGE ////////////////////////////
  if (!data.image) {
    const { path, err } = await uploadImage(data.image);
    newData.image = path;

    if (err) {
      return {
        message:
          "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
      };
    }
  }

  ///////////////////////////////////// SUBSTRACT ITEMS  ///////////////////////////////////////////////////////
  for (const item of newData.items) {
    await Items.findByIdAndUpdate(item._id, { $inc: { count: -item.count } });
  }

  newData.totalCount = newData.items.reduce((acc, item) => item.count + acc, 0);

  /////////////////////////////////////////////////// CREATE SALE ///////////////////////////////////////////////////////
  const result = await Sale.create(newData);

  if (result?._id) {
    await Account.findByIdAndUpdate(newData.income, {
      $inc: { balance: +Number(newData.cashAmount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { borrow: +Number(newData.lendAmount) },
    });

    await Account.findByIdAndUpdate(newData.buyer, {
      $inc: { lend: +Number(newData.lendAmount) },
    });
  }
  return result;
});

//

//

//

//

//

//

export const getAllSales = catchAsync(async (filter) => {
  if (filter.buyer) {
    filter.buyer = filter.buyer.split("_")[1];
  }

  const count = await Sale.countDocuments();

  const features = new APIFeatures(Sale.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(
    ["buyer", "income", "items.product", "items.unit", "items.depot"],
    "name"
  );

  return { result, count };
});
//

//

//

//

//

//

export const deleteSale = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });

  if (company.balance < data.cashAmount)
    return {
      message: `برای پرداخت پول مشتری در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  for (const item of data.items) {
    await Items.findByIdAndUpdate(item._id, { $inc: { count: item.count } });
  }

  const result = await Sale.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    await Account.findByIdAndUpdate(data.income, {
      $inc: { balance: -Number(data.cashAmount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { borrow: -Number(data.lendAmount || 0) },
    });

    await Account.findByIdAndUpdate(data.buyer, {
      $inc: { lend: -Number(data.lendAmount || 0) },
    });
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

export const updateSale = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData, image: currentData.image };
  const company = await Account.findById(currentData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
  });

  if (company.METUbalance < myNewData.metuAmount)
    return {
      message: `برای پرداخت میتیو در حساب میتیو بیلانس کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
    };

  if (currentData.buyer !== myNewData.buyer) {
    const newBuyer = await Account.findById(myNewData.buyer, {
      lend: 1,
      _id: 0,
    });
    const currentBuyer = await Account.findById(currentData.buyer, {
      lend: 1,
      _id: 0,
    });

    const newBuyerData = {
      lend: Number(newBuyer.lend || 0) + Number(myNewData.lendAmount || 0),
    };

    const currentBuyerData = {
      lend:
        Number(currentBuyer.lend || 0) - Number(currentData.lendAmount || 0),
    };

    await Account.findByIdAndUpdate(myNewData.buyer, newBuyerData);
    await Account.findByIdAndUpdate(currentData.buyer, currentBuyerData);
  } else {
    const buyer = await Account.findById(myNewData.buyer, {
      lend: 1,

      _id: 0,
    });

    const buyerData = {
      lend:
        Number(buyer.lend) -
        (Number(currentData.lendAmount || 0) -
          Number(myNewData.lendAmount || 0)),
    };

    await Account.findByIdAndUpdate(myNewData.buyer, buyerData);
  }

  //////////////////////////////////  REMOVE OLD VERSION OF ITEMS /////////////////////////////////////
  for (const item of currentData.items) {
    await Items.findByIdAndUpdate(item._id, { $inc: { count: item.count } });
  }

  //////////////////////////////////// ADD NEW VERSION OF ITEMS ///////////////////////////////////////

  for (const item of newData.items) {
    await Items.findByIdAndUpdate(item._id, { $inc: { count: -item.count } });
  }

  ////////////////////////////////////// UPDATE SALE ///////////////////////////////////////////////////////////

  const result = await Sale.findByIdAndUpdate(currentData._id, myNewData);

  if (result?._id) {
    await Account.findByIdAndUpdate(currentData.income, {
      $inc: {
        balance: -(
          Number(currentData.cashAmount) - Number(myNewData.cashAmount)
        ),
      },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: {
        lend: -(
          Number(currentData.lendAmount || 0) -
          Number(myNewData.lendAmount || 0)
        ),
      },
    });
  }
  return result;
});

////////////////////////////////////////////////// aggregation ////////////////////////////////////////////////

export const getSixMonthSaleData = catchAsync(async () => {
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
      $match: { $or: filter },
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

export const getBiggestSeller = catchAsync(async () => {
  const result = await Sale.aggregate([
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
        from: "accounts",
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
