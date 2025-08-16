import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { VendeeExternalProceed } from "@/models/vendeeExternalProceed";

////////////////////////////////  CREATE ///////////////////////////////////////////////////

export const createExternalProceed = catchAsync(async (data, owner) => {
  const newData = { ...data, owner };
  const company = await Account.findById(owner, {
    balance: 1,
  });

  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }
  const result = await VendeeExternalProceed.create(newData);

  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) + Number(newData.amount),
    };
    await Account.findByIdAndUpdate(owner, newBalance);
  }
  return result;
});

////////////////////////////// GET ALL //////////////////////////////////////////////
export const getAllExternalProceed = catchAsync(async (filter, owner) => {
  filter.owner = owner;
  const count = await VendeeExternalProceed.countDocuments();
  const features = new APIFeatures(VendeeExternalProceed.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});
////////////////////////////// DELETE //////////////////////////////////////////////
export const deleteExternalProceed = catchAsync(async (data, owner) => {
  const company = await Account.findById(owner, {
    balance: 1,
  });
  if (company.balance < data.amount)
    return {
      message: `شما بیلانس کافی برای پرداخت ندارید بیلانس شما ${company.balance}  می باشد `,
    };

  const result = await VendeeExternalProceed.findByIdAndDelete(data._id);
  await deleteFile(data.image);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) - Number(data.amount),
    };
    await Account.findByIdAndUpdate(owner, newBalance);
  }
  return result;
});
///////////////////////////////// UPDATE ////////////////////////////////////////////

export const updateExternalProceed = catchAsync(
  async ({ currentData, newData }, owner) => {
    const myNewData = { ...newData, image: currentData.image };

    const company = await Account.findById(owner, {
      balance: 1,
    });

    const result = await VendeeExternalProceed.findByIdAndUpdate(
      currentData._id,
      myNewData
    );
    if (result._id) {
      const newBalance = {
        balance:
          Number(company.balance) -
          (Number(currentData.amount) - Number(myNewData.amount)),
      };
      await Account.findByIdAndUpdate(owner, newBalance);
    }
    return result;
  }
);
