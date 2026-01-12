import APIFeatures from "@/lib/apiFeatues";
import { generateBillNumber } from "@/lib/billNumberGenerator";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Currency } from "@/models/Currency";
import { FinancialAccount } from "@/models/FinancialAccount";
import { Items } from "@/models/items";
import { Sale } from "@/models/Sale";
import moment from "moment-jalaali";

export const createSale = catchAsync(async (data) => {
  const newData = { ...data };

  const currency = await Currency.findById(newData.currency);

  if (!currency || typeof currency.rate !== "number") {
    throw new Error("Invalid currency or currency rate");
  }
  newData.totalAmount = (newData.totalAmount || 0) * currency.rate;
  newData.totalAmountBeforDiscount =
    (newData.totalAmountBeforDiscount || 0) * currency.rate;
  newData.cashAmount = (newData.cashAmount || 0) * currency.rate;
  newData.lendAmount = (newData.lendAmount || 0) * currency.rate;
  newData.totalProfit = (newData.totalProfit || 0) * currency.rate;
  newData.currency = currency;
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

  const buyer = await Account.findByIdAndUpdate(
    newData.buyer,
    {
      $inc: { lend: +Number(newData.lendAmount) },
    },
    { new: true }
  );
  const { _id } = await FinancialAccount.create({
    name: newData.buyer,
    credit: 0,
    debit: newData.lendAmount,
    balance: buyer.borrow - buyer.lend,
  });

  newData.financial = _id;

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
  } else {
    await Account.findByIdAndUpdate(newData.buyer, {
      $inc: { lend: -Number(newData.lendAmount) },
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

  await FinancialAccount.findByIdAndDelete(data.financial);

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

  const currency = await Currency.findById(newData.currency);

  if (!currency || typeof currency.rate !== "number") {
    throw new Error("Invalid currency or currency rate");
  }
  myNewData.totalAmount = (myNewData.totalAmount || 0) * currency.rate;
  myNewData.totalAmountBeforDiscount =
    (myNewData.totalAmountBeforDiscount || 0) * currency.rate;
  myNewData.cashAmount = (myNewData.cashAmount || 0) * currency.rate;
  myNewData.lendAmount = (myNewData.lendAmount || 0) * currency.rate;
  myNewData.totalProfit = (myNewData.totalProfit || 0) * currency.rate;
  myNewData.currency = currency;

  const company = await Account.findById(currentData.income, {
    balance: 1,
  });

  if (company.METUbalance < myNewData.metuAmount)
    return {
      message: `برای پرداخت میتیو در حساب میتیو بیلانس کافی ندارید بیلانس شما${company.METUbalance} می باشد`,
    };

  if (currentData.buyer !== myNewData.buyer) {
    const buyer = await Account.findByIdAndUpdate(
      myNewData.buyer,
      { $inc: { lend: Number(myNewData.lendAmount || 0) } },
      { new: true }
    );
    await Account.findByIdAndUpdate(currentData.buyer, {
      $inc: { lend: -Number(currentData.lendAmount || 0) },
    });
    const { _id } = await FinancialAccount.findByIdAndUpdate(
      currentData.financial,
      {
        date: new Date(),
        name: myNewData.buyer,
        debit: myNewData.lendAmount,
        credit: 0,
        balance: buyer.borrow - buyer.lend,
      }
    );

    myNewData.financial = _id;
  } else {
    await Account.findByIdAndUpdate(
      myNewData.buyer,
      {
        $inc: {
          lend: -(
            Number(currentData.lendAmount || 0) -
            Number(myNewData.lendAmount || 0)
          ),
        },
      },
      { new: true }
    );
    const { _id } = await FinancialAccount.findByIdAndUpdate(
      currentData.financial,
      {
        $set: {
          name: myNewData.buyer,
          credit: 0,
          debit: myNewData.lendAmount,
        },
        $inc: {
          balance: myNewData.lendAmount - currentData.lendAmount,
        },
      }
    );
    myNewData.financial = _id;
  }

  //////////////////////////////////  REMOVE OLD VERSION OF ITEMS /////////////////////////////////////
  for (const item of currentData.items) {
    await Items.findByIdAndUpdate(item._id, { $inc: { count: item.count } });
  }

  //////////////////////////////////// ADD NEW VERSION OF ITEMS ///////////////////////////////////////

  for (const item of myNewData.items) {
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
