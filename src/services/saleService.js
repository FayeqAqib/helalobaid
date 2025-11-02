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

  const company = await Account.findById(newData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
  });

  const buyer = await Account.findById(newData.buyer, {
    lend: 1,
  });

  newData.items.forEach(async (item) => {
    const itemData = await Items.findById(item.id);
    if (itemData.count > item.count) {
      await Items.findByIdAndUpdate(item.id, { $inc: { count: -item.count } });
    } else {
      await Items.findByIdAndUpdate(item.id, { count: 0 });
    }
  });

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  newData.totalCount = newData.items.reduce((acc, item) => item.count + acc, 0);

  const result = await Sale.create(newData);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(newData.cashAmount),
    };
    const newCompany_idData = {
      borrow: Number(company_id.borrow) + Number(newData.lendAmount),
    };
    await Account.findByIdAndUpdate(newData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (newData.lendAmount >= 1) {
      const newBuyerData = {
        lend: Number(buyer.lend) + Number(newData.lendAmount),
      };
      await Account.findByIdAndUpdate(newData.buyer, newBuyerData);
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
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
  });
  const buyer = await Account.findById(data.buyer._id, {
    lend: 1,
  });

  if (company.balance < data.cashAmount)
    return {
      message: `برای پرداخت پول مشتری در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  data.items.forEach(async (item) => {
    await Items.findByIdAndUpdate(item.id, { $inc: { count: item.count } });
  });

  const result = await Sale.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.cashAmount),
    };
    const newCompany_idData = {
      borrow: Number(company_id.borrow) - Number(data.lendAmount),
    };

    await Account.findByIdAndUpdate(data.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (data.lendAmount >= 1) {
      const newBuyerData = {
        lend: Number(buyer.lend) - Number(data.lendAmount),
      };
      await Account.findByIdAndUpdate(data.buyer, newBuyerData);
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
      lend: Number(newBuyer.lend) + Number(myNewData.lendAmount),
    };

    const currentBuyerData = {
      lend: Number(currentBuyer.lend) - Number(currentData.lendAmount),
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
        (Number(currentData.lendAmount) - Number(myNewData.lendAmount)),
    };

    await Account.findByIdAndUpdate(myNewData.buyer, buyerData);
  }

  currentData.items.forEach(async (item) => {
    const itemData = await Items.findById(item.id);
    if (itemData) {
      await Items.findByIdAndUpdate(item.id, { $inc: { count: item.count } });
    } else {
      Items.create(item);
    }
  });

  newData.items.forEach(async (item) => {
    const itemData = await Items.findById(item.id);
    if (itemData.count > item.count) {
      await Items.findByIdAndUpdate(item.id, { $inc: { count: -item.count } });
    } else {
      Items.deleteOne({ _id: item.id });
    }
  });

  const result = await Sale.findByIdAndUpdate(currentData._id, myNewData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) -
        (Number(currentData.cashAmount) - Number(myNewData.cashAmount)),
    };
    const newCompany_idData = {
      borrow:
        Number(company_id.lend) -
        (Number(currentData.lendAmount) - Number(myNewData.lendAmount)),
    };

    await Account.findByIdAndUpdate(currentData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
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
