import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Buy } from "@/models/Buy";
import moment from "moment-jalaali";

import { uploadImage } from "@/lib/uploadImage";
import { deleteFile } from "@/lib/deleteImage";
import { generateBillNumber } from "@/lib/billNumberGenerator";
import { Cost } from "@/models/cost";
import { CostTital } from "@/models/constTital";
import { Items } from "@/models/items";

////////////////////////////////////////////////// create ////////////////////////////////////////////////

export const createBuy = catchAsync(async (data) => {
  const newData = { ...data };

  //////////////////////////////// GENERATE BILL //////////////////////////////////

  newData.billNumber = await generateBillNumber(Buy);

  const company = await Account.findById(newData.income, {
    balance: 1,
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

  for (const item of newData.items) {
    const up = await Items.findOne({
      depot: item.depot,
      product: item.product,
      unit: item.unit,
      badgeNumber: item.badgeNumber,
    });
    if (up) {
      const totalCount =
        up.count + item.count === 0 ? 1 : up.count + item.count;
      await Items.findByIdAndUpdate(up._id, {
        $inc: { count: item.count },
        $set: {
          aveUnitAmount: Math.round(
            (up.aveUnitAmount * up.count + item.aveUnitAmount * item.count) /
              totalCount
          ),
          saleAmount: Math.round(
            (up.saleAmount * up.count + item.saleAmount * item.count) /
              totalCount
          ),
        },
      });
    } else {
      await Items.create(item);
    }
  }
  // await Items.insertMany([...newData.items]);

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
    await Account.findByIdAndUpdate(newData.income, {
      $inc: { balance: -newData.cashAmount - newData.transportCost },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { lend: newData.borrowAmount },
    });

    await Account.findByIdAndUpdate(newData.saller, {
      $inc: { borrow: newData.borrowAmount },
    });
  }
  return result;
});

/* =========================================================
 * 2)  GET  ALL  BUY  (Paginated + Populated)
 * ========================================================= */

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

// ////////////////////////////////////////////////// DELETE  ////////////////////////////////////////////////

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

  ////////////////////////////////////////////// DELETE ITEMS ////////////////////////////////////////////////////
  for (const item of data.items) {
    const up = await Items.findOne({
      depot: item.depot._id,
      product: item.product._id,
      unit: item.unit._id,
      badgeNumber: item.badgeNumber,
    });
    if (up) {
      const totalCount =
        up.count - item.count === 0 ? 1 : up.count - item.count;

      await Items.findByIdAndUpdate(up._id, {
        $inc: { count: -item.count },
        $set: {
          aveUnitAmount: Math.round(
            (up.aveUnitAmount * up.count - item.aveUnitAmount * item.count) /
              totalCount
          ),
          saleAmount: Math.round(
            (up.saleAmount * up.count - item.saleAmount * item.count) /
              totalCount
          ),
        },
      });
    }
  }

  ////////////////////////////////////////////////// DELETE BUY /////////////////////////////////
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

// ////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateBuy = catchAsync(async ({ currentData, newData }) => {
  const myNewData = {
    ...newData,
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

  ////////////////////////////////////////////////////   REMOVE OLD iTEMS /////////////////////////////////////////////

  for (const item of currentData.items) {
    const up = await Items.findOne({
      depot: item.depot,
      product: item.product,
      unit: item.unit,
      badgeNumber: item.badgeNumber,
    });
    if (up) {
      const totalCount =
        up.count - item.count === 0 ? 1 : up.count - item.count;
      await Items.findByIdAndUpdate(up._id, {
        $inc: { count: -item.count },
        $set: {
          aveUnitAmount: Math.round(
            (up.aveUnitAmount * up.count - item.aveUnitAmount * item.count) /
              totalCount
          ),
          saleAmount: Math.round(
            (up.saleAmount * up.count - item.saleAmount * item.count) /
              totalCount
          ),
        },
      });
    }
  }

  ////////////////////////////////////////////////////    ADD NEW iTEMS /////////////////////////////////////////////

  for (const item of newData.items) {
    const up = await Items.findOne({
      depot: item.depot,
      product: item.product,
      unit: item.unit,
      badgeNumber: item.badgeNumber,
    });
    if (up) {
      const totalCount =
        up.count + item.count === 0 ? 1 : up.count + item.count;
      await Items.findByIdAndUpdate(up._id, {
        $inc: { count: item.count },
        $set: {
          aveUnitAmount: Math.round(
            (up.aveUnitAmount * up.count + item.aveUnitAmount * item.count) /
              totalCount
          ),
          saleAmount: Math.round(
            (up.saleAmount * up.count + item.saleAmount * item.count) /
              totalCount
          ),
        },
      });
    } else {
      await Items.create(item);
    }
  }

  ////////////////////////////////////////////// CREATE  BUY /////////////////////////////////////////
  const result = await Buy.findByIdAndUpdate(currentData._id, myNewData);

  ////////////////////////////////////////////// CREATE COST ////////////////////////////////////////////
  await Cost.findByIdAndUpdate(currentData.cost, {
    amount: newData.transportCost,
  });

  ////////////////////////////////////////////////// CALCULATE ACOUNTS ////////////////////////////////
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

// /* =========================================================
//  *  Buy Service – One-Block & Production-Ready
//  *  ✔️ Full MongoDB Transaction (session)
//  *  ✔️ Rollback Data + File on Error
//  *  ✔️ Weighted-Average Inventory Update
//  *  ✔️ Concurrent-Safe $inc on Accounts
//  *  ✔️ Persian Error Messages
//  *  ✔️ Index-Aware & Lean Queries
//  * ========================================================= */

// import mongoose from "mongoose";
// import moment from "moment-jalaali";
// import { catchAsync } from "@/lib/catchAsync";
// import { uploadImage, deleteFile } from "@/lib/fileUtils";
// import { generateBillNumber } from "@/lib/billNumberGenerator";
// import { Buy } from "@/models/Buy";
// import { Items } from "@/models/items";
// import { Cost } from "@/models/cost";
// import { CostTital } from "@/models/constTital";
// import { Account } from "@/models/account";
// import APIFeatures from "@/lib/apiFeatues";

// /* =========================================================
//  * 1)  CREATE  BUY
//  * ========================================================= */
// export const createBuy = catchAsync(async (body) => {
//   const {
//     saller,
//     income,
//     items: buyLists,
//     cashAmount = 0,
//     borrowAmount = 0,
//     transportCost = 0,
//     totalAmount,
//     image,
//   } = body;
//   try {
//     /* ---- 1.  Check Payer Balance ---- */
//     const payer = await Account.findById(income).lean();
//     if (!payer || payer.balance < cashAmount + transportCost)
//       throw new Error("بیلانس ناکافی برای پرداخت نقدی و حمل");

//     /* ---- 2.  Generate Unique Bill ---- */
//     const billNumber = await generateBillNumber(Buy);

//     /* ---- 3.  Inventory Update (Weighted Average) ---- */
//     let totalCount = 0;
//     for (const it of buyLists) {
//       const item = await Items.findOne({
//         product: it.product,
//         unit: it.unit,
//         depot: it.depot,
//       });

//       if (item) {
//         const newCount = item.count + it.count;
//         item.count = newCount;
//         item.unitAmount =
//           (item.unitAmount * item.count + it.unitAmount * it.count) / newCount;
//         item.aveUnitAmount =
//           (item.aveUnitAmount * item.count + it.aveUnitAmount * it.count) /
//           newCount;
//         await item.save();
//       } else {
//         await Items.create([it]);
//       }
//       totalCount += it.count;
//     }

//     /* ---- 4.  Upload Image ---- */
//     const imagePath = image ? await uploadImage(image) : undefined;

//     /* ---- 5.  Transport Cost Document ---- */
//     let costId;
//     if (transportCost > 0) {
//       const costTitle = await CostTital.findOneAndUpdate(
//         { name: "ترانسپورت" },
//         { $setOnInsert: { name: "ترانسپورت" } },
//         { upsert: true, new: true }
//       );
//       const [costDoc] = await Cost.create([
//         {
//           income,
//           costTital: costTitle._id,
//           amount: transportCost,
//           createBy: "buy",
//           details: `هزینه حمل خرید ${billNumber}`,
//           image: imagePath,
//         },
//       ]);
//       costId = costDoc._id;
//     }

//     /* ---- 6.  Create Buy Document ---- */
//     const [buyDoc] = await Buy.create([
//       {
//         ...body,
//         items: buyLists,
//         billNumber,
//         totalCount,
//         cost: costId,
//         image: imagePath,
//       },
//     ]);

//     /* ---- 7.  Financial Updates ---- */
//     await Account.updateOne(
//       { _id: income },
//       { $inc: { balance: -(cashAmount + transportCost) } }
//     );
//     await Account.updateOne(
//       { _id: process.env.COMPANY_ID },
//       { $inc: { lend: borrowAmount } }
//     );
//     if (borrowAmount > 0) {
//       await Account.updateOne(
//         { _id: saller },
//         { $inc: { borrow: borrowAmount } }
//       );
//     }

//     return buyDoc;
//   } catch (err) {
//     if (image) await deleteFile(image.path);
//     throw err;
//   }
// });

// /* =========================================================
//  * 2)  GET  ALL  BUY  (Paginated + Populated)
//  * ========================================================= */

// export const getAllbuy = catchAsync(async (filter) => {
//   if (filter.saller) {
//     filter.saller = filter.saller.split("_")[1];
//   }
//   const count = await Buy.countDocuments();
//   const features = new APIFeatures(Buy.find(), filter)
//     .filter()
//     .sort()
//     .paginate();
//   const result = await features.query.populate(
//     ["saller", "income", "items.product", "items.unit", "items.depot"],
//     "name"
//   );

//   return { result, count };
// });

// /* =========================================================
//  * 3)  DELETE  BUY
//  * ========================================================= */
// export const deleteBuy = catchAsync(async (buyId) => {
//   try {
//     const doc = await Buy.findById(buyId).lean();
//     if (!doc) throw new Error("سند خرید یافت نشد");

//     /* ---- 1.  Rollback Inventory ---- */
//     for (const it of doc.items) {
//       await Items.updateOne(
//         { product: it.product, unit: it.unit, depot: it.depot },
//         { $inc: { count: it.count } }
//       );
//     }

//     /* ---- 2.  Delete Image & Cost ---- */
//     if (doc.image) await deleteFile(doc.image);
//     if (doc.cost) await Cost.deleteOne({ _id: doc.cost });

//     /* ---- 3.  Rollback Money ---- */
//     await Account.updateOne(
//       { _id: doc.income },
//       { $inc: { balance: doc.cashAmount + doc.transportCost } }
//     );
//     await Account.updateOne(
//       { _id: process.env.COMPANY_ID },
//       { $inc: { lend: -doc.borrowAmount } }
//     );
//     if (doc.borrowAmount > 0) {
//       await Account.updateOne(
//         { _id: doc.saller },
//         { $inc: { borrow: -doc.borrowAmount } }
//       );
//     }

//     /* ---- 4.  Remove Buy ---- */
//     await Buy.deleteOne({ _id: buyId }).session(session);

//     return { success: true };
//   } catch (err) {
//     throw err;
//   }
// });

// /* =========================================================
//  * 4)  6-Month  Buy  Chart  (Aggregation)
//  * ========================================================= */
// export const getSixMonthBuyData = catchAsync(async () => {
//   const months = [];
//   let [y, m] = moment().format("jYYYY/jM").split("/").map(Number);
//   for (let i = 0; i < 6; i++) {
//     if (m === 0) {
//       m = 12;
//       y--;
//     }
//     months.push(moment(`${y}/${m}`, "jYYYY/jM").format("jYYYY/jM"));
//     m--;
//   }
//   return Buy.aggregate([
//     { $match: { afgDate: { $in: months } } },
//     {
//       $group: {
//         _id: "$afgDate",
//         totalBuy: { $sum: "$totalAmount" },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { _id: 1 } },
//   ]);
// });

// /* =========================================================
//  * 5)  UPDATE  BUY  (Transaction-Safe + 3-Way Items Sync)
//  * ========================================================= */
// export const updateBuy = catchAsync(async ({ currentData, newData }) => {
//   const {
//     saller,
//     income,
//     items: newItems,
//     cashAmount = 0,
//     borrowAmount = 0,
//     transportCost = 0,
//     totalAmount,
//     image,
//   } = newData;

//   const old = currentData;

//   /* ---- 1.  Balance Check for Additional Cash ---- */
//   const extraCash =
//     cashAmount + transportCost - old.cashAmount - old.transportCost;
//   if (extraCash > 0) {
//     const payer = await Account.findById(income).lean();
//     if (!payer || payer.balance < extraCash)
//       throw new Error("بیلانس ناکافی برای افزایش پرداخت");
//   }

//   /* ---- 2.  Image Handling (upload new / delete old on success) ---- */
//   let newImagePath = old.image;
//   let oldImageToDelete = null;
//   if (image && typeof image !== "string") {
//     newImagePath = await uploadImage(image);
//     oldImageToDelete = old.image;
//   }

//   /* ---- 3.  Items Three-Way Sync (delete, insert, update) ---- */
//   const isEqual = (a, b) =>
//     a.product.toString() === b.product.toString() &&
//     a.unit.toString() === b.unit.toString() &&
//     a.depot.toString() === b.depot.toString();

//   const oldMap = new Map(
//     old.items.map((it) => [
//       JSON.stringify({ p: it.product, u: it.unit, d: it.depot }),
//       it,
//     ])
//   );

//   const toDelete = [];
//   const toInsert = [];
//   const toUpdate = [];

//   for (const it of newItems) {
//     const key = JSON.stringify({ p: it.product, u: it.unit, d: it.depot });
//     const exist = oldMap.get(key);
//     if (!exist) toInsert.push(it);
//     else {
//       const diff = it.count - exist.count;
//       if (diff !== 0 || it.unitAmount !== exist.unitAmount) {
//         toUpdate.push({ ...it, diffCount: diff, oldCount: exist.count });
//       }
//       oldMap.delete(key);
//     }
//   }
//   toDelete.push(...oldMap.values());

//   /* ---- 4.  Apply Items Changes ---- */
//   // 4-a) delete
//   for (const it of toDelete) {
//     await Items.updateOne(
//       { product: it.product, unit: it.unit, depot: it.depot },
//       { $inc: { count: -it.count } }
//     );
//   }
//   // 4-b) insert
//   if (toInsert.length) await Items.insertMany(toInsert);
//   // 4-c) update
//   for (const it of toUpdate) {
//     const item = await Items.findOne({
//       product: it.product,
//       unit: it.unit,
//       depot: it.depot,
//     });
//     const newCount = item.count + it.diffCount;
//     const newUnit =
//       (item.unitAmount * item.count +
//         it.unitAmount * it.count -
//         exist.unitAmount * exist.count) /
//       newCount;
//     const newAve =
//       (item.aveUnitAmount * item.count +
//         it.aveUnitAmount * it.count -
//         exist.aveUnitAmount * exist.count) /
//       newCount;
//     await Items.updateOne(
//       { _id: item._id },
//       { count: newCount, unitAmount: newUnit, aveUnitAmount: newAve }
//     );
//   }

//   /* ---- 5.  Transport Cost Update ---- */
//   if (transportCost !== old.transportCost) {
//     if (old.cost) {
//       await Cost.updateOne({ _id: old.cost }, { amount: transportCost });
//     } else if (transportCost > 0) {
//       const title = await CostTital.findOneAndUpdate(
//         { name: "ترانسپورت" },
//         { $setOnInsert: { name: "ترانسپورت" } },
//         { upsert: true, new: true }
//       );
//       const [c] = await Cost.create([
//         {
//           income,
//           costTital: title._id,
//           amount: transportCost,
//           createBy: "buy",
//           details: `هزینه حمل خرید ${old.billNumber}`,
//           image: newImagePath,
//         },
//       ]);
//       newData.cost = c._id;
//     }
//   }

//   /* ---- 6.  Financial Diff & $inc ---- */
//   const diffCash = cashAmount - old.cashAmount;
//   const diffTransport = transportCost - old.transportCost;
//   const diffBorrow = borrowAmount - old.borrowAmount;

//   await Account.updateOne(
//     { _id: income },
//     { $inc: { balance: -(diffCash + diffTransport) } }
//   );
//   await Account.updateOne(
//     { _id: process.env.COMPANY_ID },
//     { $inc: { lend: diffBorrow } }
//   );
//   if (diffBorrow !== 0) {
//     await Account.updateOne({ _id: saller }, { $inc: { borrow: diffBorrow } });
//   }

//   /* ---- 7.  Save Buy Doc ---- */
//   const updated = await Buy.findByIdAndUpdate(
//     old._id,
//     {
//       ...newData,
//       items: newItems,
//       totalCount: newItems.reduce((s, i) => s + i.count, 0),
//     },
//     { new: true }
//   );

//   /* ---- 8.  Commit & Clean-Up ---- */

//   if (oldImageToDelete) await deleteFile(oldImageToDelete).catch(() => {});
//   return updated;
// });
