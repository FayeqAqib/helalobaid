import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Receive } from "@/models/receive";

export const createReceive = catchAsync(async (data) => {
  const newData = { ...data };
  const company = await Account.findById(newData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
  });

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
    const newCompanyData = {
      balance: Number(company.balance) + Number(newData.amount),
    };
    const newCompany_idData = {
      borrow: Number(company_id.borrow) - Number(newData.amount),
    };
    await Account.findByIdAndUpdate(newData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (newData.amount >= 1) {
      const newbuyerData = {
        lend: Number(buyer.lend) - Number(newData.amount),
      };
      await Account.findByIdAndUpdate(newData.type, newbuyerData);
    }
  }
  return result;
});

export const getAllReceive = catchAsync(async (filter) => {
  if (filter.type) {
    filter.type = filter.type.split("_")[1];
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
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
  });
  const buyer = await Account.findById(data.type, {
    lend: 1,
    balance: 1,
  });

  if (company.balance < data.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  const result = await Receive.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.amount),
    };
    const newCompany_idData = {
      borrow: Number(company_id.borrow) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(data.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
    if (data.amount >= 1) {
      const newbuyerData = {
        lend: Number(buyer.lend) + Number(data.amount),
      };
      await Account.findByIdAndUpdate(data.type, newbuyerData);
    }
  }
  return result;
});

/////////////////////////////////////////////////// update ///////////////////////////////////////////

export const updateReceive = catchAsync(async ({ currentData, newData }) => {
  const myNewData = { ...newData, image: currentData.image };
  const company = await Account.findById(currentData.income, {
    balance: 1,
  });
  const company_id = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
  });

  const newBuyer = await Account.findById(myNewData.type, {
    lend: 1,
    balance: 1,
    _id: 0,
  });

  if (newBuyer.lend < myNewData.amount - currentData.amount)
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${
        currentData.type !== myNewData.type
          ? currentData.amount + newBuyer.lend
          : newBuyer.lend
      } می باشد`,
    };

  if (currentData.type !== myNewData.type) {
    const currentBuyer = await Account.findById(currentData.type, {
      lend: 1,
      _id: 0,
    });

    const currentBuyerdata = {
      lend: Number(currentBuyer.lend) + Number(currentData.amount),
      balance: Number(currentBuyer.balance) + Number(currentData.amount),
    };
    const newBuyerdata = {
      lend: Number(newBuyer.lend) - Number(myNewData.amount),
      balance: Number(newBuyer.balance) - Number(myNewData.amount),
    };

    await Account.findByIdAndUpdate(myNewData.type, newBuyerdata);
    await Account.findByIdAndUpdate(currentData.type, currentBuyerdata);
  } else {
    const newBuyerdata = {
      lend:
        Number(newBuyer.lend) -
        (Number(myNewData.amount) - Number(currentData.amount)),
    };

    await Account.findByIdAndUpdate(myNewData.type, newBuyerdata);
  }

  const result = await Receive.findByIdAndUpdate(currentData._id, myNewData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        (Number(myNewData.amount) - Number(currentData.amount)),
    };
    const newCompany_idData = {
      borrow:
        Number(company_id.borrow) -
        (Number(myNewData.amount) - Number(currentData.amount)),
    };
    await Account.findByIdAndUpdate(currentData.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);
  }

  return result;
});
