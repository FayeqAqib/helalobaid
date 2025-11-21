import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Transfer } from "@/models/transfer";

///////////////////////////////////////////CREATE TRANSFER ////////////////////////////////////////////////////
export const createTransfer = catchAsync(async (data) => {
  const newData = { ...data };

  if (newData.from === newData.to) {
    return { message: "لطفا برای انتقال دو حساب متفاوت را انتخاب کنید" };
  }
  const from = await Account.findById(newData.from, {
    balance: 1,
    name: 1,
  });

  if (from.balance < newData.amount)
    return {
      message: `برای انتقال در حساب ${from.name} پول کافی ندارین بیلاتس  ${from.balance}شما میباشد`,
    };

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  const result = await Transfer.create(newData);

  if (result?._id) {
    await Account.findByIdAndUpdate(newData.from, {
      $inc: { balance: -Number(newData.amount) },
    });
    await Account.findByIdAndUpdate(newData.to, {
      $inc: { balance: +Number(newData.amount) },
    });
  }
  return result;
});

///////////////////////////////////////////GET ALL TRANSFER ////////////////////////////////////////////////////

export const getAllTransfer = catchAsync(async (filter) => {
  if (filter.from) {
    filter.from = filter.from.split("_")[1];
  }
  if (filter.from) {
    filter.to = filter.to.split("_")[1];
  }
  const count = await Transfer.countDocuments();
  const features = new APIFeatures(Transfer.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["from", "to"], "name");

  return { result, count };
});

///////////////////////////////////////////UPDATE  TRANSFER ////////////////////////////////////////////////////

export const deleteTransfer = catchAsync(async (data) => {
  const newData = { ...data };
  const to = await Account.findById(newData.to, {
    balance: 1,
    name: 1,
  });

  if (to.balance < newData.amount)
    return {
      message: `برای بازگشت در حساب ${to.name} پول کافی ندارین بیلاتس  ${to.balance}شما میباشد`,
    };

  const result = await Transfer.findByIdAndDelete(newData._id);
  await deleteFile(newData.image);

  if (result?._id) {
    await Account.findByIdAndUpdate(newData.from, {
      $inc: { balance: +Number(newData.amount) },
    });

    await Account.findByIdAndUpdate(newData.to, {
      $inc: { balance: -Number(newData.amount) },
    });
  }

  return result;
});
