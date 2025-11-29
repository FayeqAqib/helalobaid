import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Receive } from "@/models/receive";

export const createReceive = catchAsync(async (data) => {
  const newData = { ...data };
  const buyer = await Account.findById(data.type, {
    lend: 1,
    balance: 1,
  });

  if (buyer.lend < newData.amount) {
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${buyer.lent} می باشد`,
    };
  }
  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  const result = await Receive.create(newData);

  if (result?._id) {
    await Account.findByIdAndUpdate(newData.income, {
      $inc: { balance: +Number(newData.amount) },
    });
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, {
      $inc: { borrow: -Number(newData.amount) },
    });

    await Account.findByIdAndUpdate(newData.type, {
      $inc: { lend: -Number(newData.amount) },
    });
  }
  return result;
});

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

export const deleteReceive = catchAsync(async (data) => {
  const company = await Account.findById(data.income, {
    balance: 1,
  });

  if (company.balance < data.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

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

/////////////////////////////////////////////////// update ///////////////////////////////////////////

export const updateReceive = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData, image: currentData.image };

  const newBuyer = await Account.findById(myNewData.type, {
    lend: 1,
    balance: 1,
    _id: 0,
  });

  if (newBuyer.lend < myNewData.amount - currentData.amount)
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${
        currentData.type === myNewData.type
          ? currentData.amount + newBuyer.lend
          : newBuyer.lend
      } می باشد`,
    };

  if (currentData.type !== myNewData.type) {
    if (newBuyer.lend < myNewData.amount)
      return {
        message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${newBuyer.lend} می باشد`,
      };

    await Account.findByIdAndUpdate(myNewData.type, {
      $inc: { lend: -myNewData.amount },
    });
    await Account.findByIdAndUpdate(currentData.type, {
      $inc: { lend: currentData.amount },
    });
  } else {
    await Account.findByIdAndUpdate(myNewData.type, {
      $inc: {
        lend: -(Number(myNewData.amount) - Number(currentData.amount)),
      },
    });
  }

  const result = await Receive.findByIdAndUpdate(currentData._id, myNewData);

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
