import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Currency } from "@/models/Currency";
import { FinancialAccount } from "@/models/FinancialAccount";
import { Pay } from "@/models/pay";

export const createPay = catchAsync(async (data) => {
  const newData = { ...data };
  const company = await Account.findById(newData.income, {
    balance: 1,
  });

  const saller = await Account.findById(newData.type, {
    borrow: 1,
  });

  const currency = await Currency.findById(newData.currency);

  newData.amount = newData.amount * currency.rate;
  newData.currency = currency;

  if (company.balance < newData.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };
  if (saller.borrow < newData.amount)
    return {
      message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${saller.borrow} می باشد`,
    };

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  const saller2 = await Account.findByIdAndUpdate(
    newData.type,
    {
      $inc: { borrow: -Number(newData.amount) },
    },
    { new: true },
  );

  const { _id } = await FinancialAccount.create({
    name: newData.type,
    credit: newData.amount,
    debit: 0,
    balance: saller2.borrow - saller2.lend,
  });

  newData.financial = _id;

  const result = await Pay.create(newData);

  if (result?._id) {
    await Account.findByIdAndUpdate(newData.income, {
      $inc: { balance: -Number(newData.amount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: {
        lend: -Number(newData.amount),
      },
    });
  } else {
    await Account.findByIdAndUpdate(newData.type, {
      $inc: { borrow: -Number(newData.amount) },
    });
  }
  return result;
});

/////////////////////////////////////// FIND /////////////////////////////////////////////////////////////

export const getAllPay = catchAsync(async (filter) => {
  if (filter.type) {
    filter.type = filter.type.split("_")[1];
  }
  if (filter.income) {
    filter.income = filter.income.split("_")[1];
  }
  const count = await Pay.countDocuments();
  const features = new APIFeatures(Pay.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["type", "income"], "name");

  return { result, count };
});

//////////////////////////////////////// DELETE //////////////////////////////////////////////

export const deletePay = catchAsync(async (data) => {
  const exsit = await Pay.findById(data._id);
  if (!exsit)
    return {
      message: "پرداخت مورد نظر یافت نشد یا ممکن است از قبل حذف شده باشد",
    };

  const result = await Pay.findByIdAndDelete(data._id);
  await FinancialAccount.findByIdAndDelete(data.financial);
  await deleteFile(data.image);

  if (result?._id) {
    await Account.findByIdAndUpdate(data.income, {
      $inc: { balance: +Number(data.amount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { lend: +Number(data.amount) },
    });

    await Account.findByIdAndUpdate(data.type, {
      $inc: { borrow: +Number(data.amount) },
    });
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updatePay = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData, image: currentData.image };

  const newSaller = await Account.findById(myNewData.type, {
    borrow: 1,
    _id: 0,
  });

  ///////////////////////////////////////// CHENGE CURRENCY ////////////////////////////////////////////////

  const currency = await Currency.findById(myNewData.currency);

  myNewData.amount = myNewData.amount * currency.rate;
  myNewData.currency = currency;

  if (newSaller.borrow < myNewData.amount - currentData.amount)
    return {
      message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${
        currentData.type === myNewData.type
          ? currentData.amount + newSaller.borrow
          : newSaller.borrow
      } می باشد`,
    };

  //////////////////////////////////////////////////////// UPDATE TYPE:SALLER //////////////////////////////

  if (currentData.type !== myNewData.type) {
    if (newSaller.borrow < myNewData.amount)
      return {
        message: ` پرداخت بیشر از قرض مشتری است لطفا در پرداخت خود بازنگری نمایید در حساب  قرض مشتری   ${newSaller.borrow} می باشد`,
      };

    const type2 = await Account.findByIdAndUpdate(
      myNewData.type,
      {
        $inc: { borrow: -Number(myNewData.amount) },
      },
      { new: true },
    );
    await Account.findByIdAndUpdate(currentData.type, {
      $inc: { borrow: +Number(currentData.amount) },
    });
    const { _id } = await FinancialAccount.findByIdAndUpdate(
      currentData.financial,
      {
        date: new Date(),
        name: myNewData.type,
        credit: myNewData.amount,
        debit: 0,
        balance: type2.borrow - type2.lend,
      },
    );

    myNewData.financial = _id;
  } else {
    await Account.findByIdAndUpdate(myNewData.type, {
      $inc: {
        borrow: -(Number(myNewData.amount) - Number(currentData.amount)),
      },
    });

    const { _id } = await FinancialAccount.findByIdAndUpdate(
      currentData.financial,
      {
        $set: {
          name: myNewData.type,
          credit: myNewData.amount,
          debit: 0,
        },
        $inc: {
          balance: myNewData.amount - currentData.amount,
        },
      },
    );

    myNewData.financial = _id;
  }

  ////////////////////////////////////////////////// UPDATE PAY ////////////////////////////////////////////

  const result = await Pay.findByIdAndUpdate(currentData._id, myNewData);

  //////////////////////////////////////// UPDATE ACCOUNT /////////////////////////////////////////////////

  if (result?._id) {
    await Account.findByIdAndUpdate(currentData.income, {
      $inc: {
        balance: -(Number(myNewData.amount) - Number(currentData.amount)),
      },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { lend: -(Number(myNewData.amount) - Number(currentData.amount)) },
    });
  }
  return result;
});
