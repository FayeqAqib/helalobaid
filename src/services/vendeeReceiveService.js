import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { VendeeAccount } from "@/models/vendeeAccount";
import { VendeeReceive } from "@/models/vendeeReceive";

/////////////////////////////////// CREATE///////////////////////////////////////////////

export const createReceive = catchAsync(async (data, owner) => {
  const newData = { ...data, owner };
  const company = await Account.findById(owner, {
    balance: 1,
    vendeeBorrow: 1,
  });
  const buyer = await VendeeAccount.findById(newData.buyer, {
    lend: 1,
  });

  if (buyer.lend < newData.amount)
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${buyer.lend} می باشد`,
    };
  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }

  const result = await VendeeReceive.create(newData);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(newData.amount),
      vendeeBorrow: Number(company.vendeeBorrow) - Number(newData.amount),
    };
    await Account.findByIdAndUpdate(owner, newCompanyData);
    if (newData.amount >= 1) {
      const newbuyerData = {
        lend: Number(buyer.lend) - Number(newData.amount),
      };
      await VendeeAccount.findByIdAndUpdate(newData.buyer, newbuyerData);
    }
  }
  return result;
});

//////////////////////////// GET ALL /////////////////////////////////////////

export const getAllReceive = catchAsync(async (filter, owner) => {
  filter.owner = owner;
  if (filter.buyer) {
    filter.buyer = filter.buyer.split("_")[1];
  }
  const count = await VendeeReceive.countDocuments();
  const features = new APIFeatures(VendeeReceive.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("buyer", "name");

  return { result, count };
});

/////////////////////////////////////////////// DELETE //////////////////////
export const deleteReceive = catchAsync(async (data, owner) => {
  const company = await Account.findById(owner, {
    balance: 1,
    vendeeBorrow: 1,
  });
  const buyer = await VendeeAccount.findById(data.buyer, {
    lend: 1,
  });

  if (company.balance < data.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  const result = await VendeeReceive.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.amount),
      vendeeBorrow: Number(company.vendeeBorrow) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(owner, newCompanyData);
    if (data.amount >= 1) {
      const newbuyerData = {
        lend: Number(buyer.lend) + Number(data.amount),
      };
      await VendeeAccount.findByIdAndUpdate(data.buyer, newbuyerData);
    }
  }
  return result;
});

/////////////////////////////////////////////////// update ///////////////////////////////////////////

export const updateReceive = catchAsync(
  async ({ currentData, newData }, owner) => {
    const myNewData = { ...newData, image: currentData.image };
    const company = await Account.findById(owner, {
      balance: 1,
      vendeeBorrow: 1,
    });
    const newBuyer = await VendeeAccount.findById(myNewData.buyer, {
      lend: 1,
      _id: 0,
    });

    if (newBuyer.lend < myNewData.amount - currentData.amount)
      return {
        message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${
          currentData.buyer !== myNewData.buyer
            ? currentData.amount + newBuyer.lend
            : newBuyer.lend
        } می باشد`,
      };

    if (currentData.buyer !== myNewData.buyer) {
      const currentBuyer = await VendeeAccount.findById(currentData.buyer, {
        lend: 1,
        _id: 0,
      });
      currentBuyer.lend =
        Number(currentBuyer.lend) + Number(currentData.amount);
      newBuyer.lend = Number(newBuyer.lend) - Number(myNewData.amount);

      await VendeeAccount.findByIdAndUpdate(myNewData.buyer, newBuyer);
      await VendeeAccount.findByIdAndUpdate(currentData.buyer, currentBuyer);
    } else {
      newBuyer.lend =
        Number(newBuyer.lend) -
        (Number(myNewData.amount) - Number(currentData.amount));

      await VendeeAccount.findByIdAndUpdate(myNewData.buyer, newBuyer);
    }

    const result = await VendeeReceive.findByIdAndUpdate(
      currentData._id,
      myNewData
    );

    if (result?._id) {
      const newCompanyData = {
        balance:
          Number(company.balance) +
          (Number(myNewData.amount) - Number(currentData.amount)),
        vendeeBorrow:
          Number(company.vendeeBorrow) -
          (Number(myNewData.amount) - Number(currentData.amount)),
      };

      await Account.findByIdAndUpdate(owner, newCompanyData);
    }

    return result;
  }
);
