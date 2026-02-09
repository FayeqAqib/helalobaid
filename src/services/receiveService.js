import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Currency } from "@/models/Currency";
import { FinancialAccount } from "@/models/FinancialAccount";
import { Receive } from "@/models/receive";

export const createReceive = catchAsync(async (data) => {
  const newData = { ...data };
  const buyer = await Account.findById(data.type, {
    lend: 1,
    balance: 1,
  });

  ////////////////////////////////////// CHANGE CURRENCY ///////////////////////////////////////////////////
  const currency = await Currency.findById(newData.currency);

  newData.amount = newData.amount * currency.rate;
  newData.currency = currency;
  if (buyer.lend < newData.amount) {
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${buyer.lend} می باشد`,
    };
  }

  ////////////////////////// UPLOAD IMAGE //////////////////////////////////////////////////

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  /////////////////////////////////////////////// UPDATE TYPE //////////////////////////////////////////

  const type = await Account.findByIdAndUpdate(
    newData.type,
    {
      $inc: { lend: -Number(newData.amount) },
    },
    { new: true },
  );

  ////////////////////////////////////////////////////CREATE FINANTIAL /////////////////////////////////////

  const { _id } = await FinancialAccount.create({
    name: newData.type,
    debit: 0,
    credit: newData.amount,
    balance: type.borrow - type.lend,
  });

  newData.financial = _id;

  ///////////////////////////////////////////////////// CREATE RECEIVE /////////////////////////////////////

  const result = await Receive.create(newData);

  ////////////////////////////////////////// UPDATE ACCOUNT /////////////////////////////////////
  if (result?._id) {
    await Account.findByIdAndUpdate(newData.income, {
      $inc: { balance: +Number(newData.amount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { borrow: -Number(newData.amount) },
    });
  } else {
    await Account.findByIdAndUpdate(newData.type, {
      $inc: { lend: Number(newData.amount) },
    });
  }
  return result;
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////    GET    ///////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
export const getAllReceive = catchAsync(async (filter) => {
  if (filter.type) {
    filter.type = filter.type.split("_")[1];
  }
  if (filter.income) {
    filter.income = filter.income.split("_")[1];
  }
  const count = await Receive.countDocuments();
  const features = new APIFeatures(Receive.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["type", "income"], "name");

  return { result, count };
});

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////     DELETE        ////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

export const deleteReceive = catchAsync(async (data) => {
  const exsit = await Receive.findById(data._id);
  if (!exsit)
    return { message: "مورد نظر یافت نشد یا ممکن است از قبل حذف شده باشد" };

  const company = await Account.findById(data.income, {
    balance: 1,
  });

  if (company.balance < data.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  await FinancialAccount.findByIdAndDelete(data.financial);
  const result = await Receive.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    await Account.findByIdAndUpdate(data.income, {
      $inc: { balance: -Number(data.amount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { borrow: Number(data.amount) },
    });

    await Account.findByIdAndUpdate(data.type, {
      $inc: { lend: Number(data.amount) },
    });
  }
  return result;
});

/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////// UPDATE ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////

export const updateReceive = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData, image: currentData.image };

  const newBuyer = await Account.findById(myNewData.type, {
    lend: 1,
    balance: 1,
    _id: 0,
  });

  ////////////////////////////////////// CHANGE CURRENCY /////////////////////////////////////////////////
  const currency = await Currency.findById(myNewData.currency);

  myNewData.amount = myNewData.amount * currency.rate;
  myNewData.currency = currency;

  if (newBuyer.lend < myNewData.amount - currentData.amount)
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${
        currentData.type === myNewData.type
          ? currentData.amount + newBuyer.lend
          : newBuyer.lend
      } می باشد`,
    };

  ////////////////////////////////////////////// UPDATE TYPE ///////////////////////////////////////////

  if (currentData.type !== myNewData.type) {
    if (newBuyer.lend < myNewData.amount)
      return {
        message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${newBuyer.lend} می باشد`,
      };

    const type = await Account.findByIdAndUpdate(
      myNewData.type,
      {
        $inc: { lend: -myNewData.amount },
      },
      { new: true },
    );
    await Account.findByIdAndUpdate(currentData.type, {
      $inc: { lend: currentData.amount },
    });
    const { _id } = await FinancialAccount.findByIdAndUpdate(
      currentData.financial,
      {
        date: new Date(),
        name: myNewData.type,
        debit: 0,
        credit: myNewData.amount,
        balance: type.borrow - type.lend,
      },
    );

    myNewData.financial = _id;
  } else {
    await Account.findByIdAndUpdate(
      myNewData.type,
      {
        $inc: {
          lend: -(Number(myNewData.amount) - Number(currentData.amount)),
        },
      },
      { new: true },
    );

    const { _id } = await FinancialAccount.findByIdAndUpdate(
      currentData.financial,
      {
        $set: {
          name: myNewData.type,
          debit: 0,
          credit: myNewData.amount,
        },
        $inc: {
          balance: -(myNewData.amount - currentData.amount),
        },
      },
    );

    myNewData.financial = _id;
  }

  ////////////////////////////////////////////////// UPDATE RECEIVE /////////////////////////////////////

  const result = await Receive.findByIdAndUpdate(currentData._id, myNewData);

  ///////////////////////////////////////////// UPDATE ACCOUNT /////////////////////////////////////////////
  if (result?._id) {
    await Account.findByIdAndUpdate(currentData.income, {
      $inc: {
        balance: Number(myNewData.amount) - Number(currentData.amount),
      },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: {
        borrow: -(Number(myNewData.amount) - Number(currentData.amount)),
      },
    });
  }

  return result;
});
