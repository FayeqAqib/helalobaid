import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import moment from "moment-jalaali";

import { uploadImage } from "@/lib/uploadImage";
import { deleteFile } from "@/lib/deleteImage";
import { generateBillNumber } from "@/lib/billNumberGenerator";
import { DepotItems } from "@/models/depotItems";
import { Cost } from "@/models/cost";
import { CostTital } from "@/models/constTital";
import { Items } from "@/models/items";

////////////////////////////////////////////////// create ////////////////////////////////////////////////

export const createBuy = catchAsync(async (data) => {
  const newData = { ...data, items: data.buyLists };

  //////////////////////////////// GENERATE BILL //////////////////////////////////

  newData.billNumber = await generateBillNumber(Buy);

  const company = await Account.findById(newData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
    METUbalance: 1,
  });
  const saller = await Account.findById(newData.saller, {
    borrow: 1,
    METUbalance: 1,
  });

  if (company.balance < newData.cashAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  if (company.balance < newData.cashAmount + newData.transportCost)
    return {
      message: `برای پرداخت پول ترانسپورت در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  //////////////////////////////////////////////////// UPLOAD IMAGE ////////////////////////////////////////////////

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  newData.items.forEach(async (item) => {
    const itemData = await Items.findOne({
      $and: [
        { depot: item.depot },
        { product: item.product },
        { unit: item.unit },
      ],
    });

    if (itemData) {
      const updateData = {
        count: itemData.count + item.count,
        unitAmount:
          (itemData.unitAmount * itemData.count +
            item.unitAmount * item.count) /
          (itemData.count + item.count),
        aveUnitAmount:
          (itemData.aveUnitAmount * itemData.count +
            item.aveUnitAmount * item.count) /
          (itemData.count + item.count),
      };
      await Items.findByIdAndUpdate(itemData._id, updateData);
    } else {
      await Items.create(item);
    }
  });

  ////////////////////////////////////////// CREATE TRANSPORT COST//////////////////////////////////////////////
  const costTital = await CostTital.findOneAndUpdate(
    { name: "ترانسپورت" },
    { $setOnInsert: { name: "ترانسپورت" } },
    {
      upsert: true, // ایجاد اگر وجود نداشت
      new: true, // بازگرداندن سند جدید
      runValidators: true, // اجرای اعتبارسنجی‌ها
    }
  );

  const costData = {
    income: newData.income,
    costTital: costTital._id,
    amount: newData.transportCost,
    createBy: "buy",
    details: `مصارف از درک ترانسپورت  خرید  با بل نمبر ${newData.billNumber} صورت گرفته.`,
  };

  let cost;
  if (newData.transportCost > 0) {
    cost = await Cost.create(costData);
  }

  ////////////////////////////////////// CREATE BUY //////////////////////////////////////////////////////////////////////

  if (newData.transportCost > 0) {
    newData.cost = cost._id;
  }
  newData.totalCount = newData.items.reduce((acc, item) => item.count + acc, 0);
  const result = await Buy.create(newData);
  /////////////////////////////////////////////////// UPDATE ACCOUNT DATA /////////////////////////////////////////////////
  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) -
        Number(newData.cashAmount) -
        Number(newData.transportCost),
    };
    const newCompany_idData = {
      lend: Number(company_id.lend) + Number(newData.borrowAmount),
    };
    await Account.findByIdAndUpdate(newData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (newData.borrowAmount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) + Number(newData.borrowAmount),
      };
      await Account.findByIdAndUpdate(newData.saller, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// FIND ////////////////////////////////////////////////

export const getAllbuy = catchAsync(async (filter) => {
  if (filter.saller) {
    filter.saller = filter.saller.split("_")[1];
  }
  const count = await Buy.countDocuments();
  const features = new APIFeatures(Buy.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(
    ["saller", "income", "items.product", "items.unit", "items.depot"],
    "name"
  );

  return { result, count };
});

////////////////////////////////////////////////// DELETE  ////////////////////////////////////////////////

export const deleteBuy = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
  });

  const saller = await Account.findById(data.saller._id, {
    borrow: 1,
  });
  ////////////////////////////////////////////////// DELETE BUY /////////////////////////////////

  newData.items.forEach(async (item) => {
    const itemData = await Items.findOne({
      $and: [
        { depot: item.depot },
        { product: item.product },
        { unit: item.unit },
      ],
    });

    if (itemData.count > item.count) {
      const updateData = {
        count: itemData.count - item.count,
        unitAmount:
          (itemData.unitAmount * itemData.count -
            item.unitAmount * item.count) /
          (itemData.count - item.count),
        aveUnitAmount:
          (itemData.aveUnitAmount * itemData.count -
            item.aveUnitAmount * item.count) /
          (itemData.count - item.count),
      };
      await Items.findByIdAndUpdate(itemData._id, updateData);
    } else {
      await Items.findByIdAndUpdate(itemData._id, {
        count: 0,
        unitAmount: 0,
        aveUnitAmount: 0,
      });
    }
  });

  const result = await Buy.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  //////////////////////////////////////////// DELETE COST ///////////////////////////////////////

  await Cost.findByIdAndDelete(data.cost);

  /////////////////////////////////////////// UPDATE ACCOUNT ///////////////////////////////////////

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        Number(data.cashAmount) +
        Number(data.transportCost),
    };
    const newCompany_idData = {
      lend: Number(company_id.lend) - Number(data.borrowAmount),
    };
    await Account.findByIdAndUpdate(data.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (data.borrowAmount >= 1) {
      const newSallerData = {
        borrow: Number(saller.borrow) - Number(data.borrowAmount),
      };
      await Account.findByIdAndUpdate(data.saller, newSallerData);
    }
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateBuy = catchAsync(async ({ currentData, newData }) => {
  const myNewData = {
    ...newData,
    items: newData.buyLists,
    image: currentData.image,
  };

  const company = await Account.findById(myNewData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    lend: 1,
  });

  if (company.balance < myNewData.cashAmount - currentData.cashAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  if (currentData.saller !== myNewData.saller) {
    const newSaller = await Account.findById(myNewData.saller, {
      borrow: 1,
      _id: 0,
    });
    const currentSaller = await Account.findById(currentData.saller, {
      borrow: 1,
      _id: 0,
    });
    currentSaller.borrow =
      Number(currentSaller.borrow) - Number(currentData.borrowAmount);
    newSaller.borrow =
      Number(newSaller.borrow) + Number(myNewData.borrowAmount);

    await Account.findByIdAndUpdate(myNewData.saller, newSaller);
    await Account.findByIdAndUpdate(currentData.saller, currentSaller);
  } else {
    const saller = await Account.findById(myNewData.saller, {
      borrow: 1,
      _id: 0,
    });
    saller.borrow =
      Number(saller.borrow) -
      (Number(currentData.borrowAmount) - Number(myNewData.borrowAmount));
    await Account.findByIdAndUpdate(myNewData.saller, saller);
  }
  const isEqual = (obj1, obj2) => {
    return (
      obj1.unit === obj2.unit._id.toString() &&
      obj1.product === obj2.product._id.toString() &&
      obj1.depot === obj2.depot._id.toString()
    );
  };

  const itemForDelete = currentData.items
    .filter((objY) => !myNewData.items.some((objX) => isEqual(objX, objY)))
    .map((item) => item._id);

  const itemForCreate = myNewData.items
    .filter((objX) => !currentData.items.some((objY) => isEqual(objX, objY)))
    .map((item) => {
      delete item._id;
      return item;
    });

  const itemForUpdate = currentData.items.filter((objY) =>
    myNewData.items.some((objX) => isEqual(objX, objY))
  );

  if (itemForCreate.length > 0) await Items.insertMany(itemForCreate);

  if (itemForDelete.length > 0)
    await Items.deleteMany({ _id: { $in: itemForDelete } });

  itemForUpdate.forEach(async (item) => {
    const itemData = await Items.findOne({
      $and: [
        { depot: item.depot },
        { product: item.product },
        { unit: item.unit },
      ],
    });

    myNewData.items.forEach(async (i) => {
      if (isEqual(i, item)) {
        const updateData = {
          myId: itemData._id,
          count: itemData.count - item.count + i.count,
          unitAmount:
            (itemData.unitAmount * itemData.count -
              item.unitAmount * item.count +
              i.unitAmount * i.count) /
            (itemData.count - item.count + i.count),
          aveUnitAmount:
            (itemData.aveUnitAmount * itemData.count -
              item.aveUnitAmount * item.count +
              i.aveUnitAmount * i.count) /
            (itemData.count - item.count + i.count),
        };

        await Items.findByIdAndUpdate(updateData._id, updateData);
      }
    });
  });

  const result = await Buy.findByIdAndUpdate(currentData._id, myNewData);
  Cost.findByIdAndUpdate(currentData.cost, { amount: newData.transportCost });

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        (Number(currentData.cashAmount) - Number(myNewData.cashAmount)),
    };
    const newCompany_idData = {
      lend:
        Number(company_id.lend) -
        (Number(currentData.borrowAmount) - Number(myNewData.borrowAmount)),
    };
    await Account.findByIdAndUpdate(myNewData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
  }
  return result;
});

////////////////////////////////////////////////// aggregation ////////////////////////////////////////////////

export const getSixMonthBuyData = catchAsync(async () => {
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
  const result = await Buy.aggregate([
    {
      $match: { $or: filter },
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
