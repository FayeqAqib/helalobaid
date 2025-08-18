import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Account } from "@/models/account";
import { Applecation } from "@/models/applecation";
import { Sale } from "@/models/Sale";

export const createApplecation = catchAsync(async (data, owner) => {
  const newData = { ...data };

  const company = await Account.findById(owner, {
    balance: 1,
    lend: 1,
  });

  if (company.balance < data.cashAmount) {
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
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

  const result = await Applecation.create({
    ...newData,
    buyer: owner,
    status: "pending",
  });

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(newData.cashAmount),
      lend: Number(company.lend) + Number(newData.lendAmount),
    };

    await Account.findByIdAndUpdate(owner, newCompanyData);
  }
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllApplecation = catchAsync(async (filter) => {
  if (filter.buyer) {
    filter.buyer = filter.buyer.split("_")[1];
  }
  if (!filter.sort) {
    filter.sort = "sendDate,true";
  }

  const count = await Applecation.countDocuments();
  const features = new APIFeatures(Applecation.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("buyer", "name");
  return { result, count };
});
////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllVendeeApplecation = catchAsync(async (filter, owner) => {
  filter.buyer = owner;

  const count = await Applecation.countDocuments();
  const features = new APIFeatures(Applecation.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(["buyer", "income"], "name");
  return { result, count };
});

////////////////////////////////////////////////// delete ////////////////////////////////////////////////

export const deleteApplecation = catchAsync(async (data, owner) => {
  const company = await Account.findById(owner, {
    balance: 1,
    lend: 1,
  });

  const app = await Applecation.findById(data._id, {
    status: 1,
  });

  if (app.status !== "pending") {
    return {
      message: "حذف این مورد ممکن نیست چون فروشنده آنرا بررسی کرده",
    };
  }

  const result = await Applecation.findByIdAndDelete(data._id);
  await deleteFile(data.image);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.cashAmount),
      lend: Number(company.lend) - Number(data.lendAmount),
    };
    await Account.findByIdAndUpdate(owner, newCompanyData);
  }

  return result;
});
//////////////////////////////////// CHECK STATUS ///////////////////////////////////////////////////
export const StatusCheck = catchAsync(async () => {
  const result = await Applecation.countDocuments({ status: "pending" });
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateApplecation = catchAsync(async (data) => {
  const buyer = await Account.findById(data.buyer._id, {
    METUbalance: 1,
    balance: 1,
    lend: 1,
  });

  if (data.status === "reject") {
    const newBuyerData = {
      balance: Number(buyer.balance) + Number(data.cashAmount),
      lend: Number(buyer.lend) - Number(data.lendAmount),
    };
    await Account.findByIdAndUpdate(buyer._id, newBuyerData);
    const { income, ...rejectData } = data;
    const result = await Applecation.findByIdAndUpdate(data._id, rejectData);
    return result;
  }
  const company = await Account.findById(data.income, {
    balance: 1,
  });

  const company_id = await Account.findById(process.env.COMPANY_ID, {
    borrow: 1,
    METUbalance: 1,
  });

  if (company_id.METUbalance < data.metuAmount)
    return {
      message: `برای پرداخت  در حساب خود بیلانس میتیو کافی ندارید بیلانس شما${company_id.METUbalance} می باشد`,
    };

  const result = await Applecation.findByIdAndUpdate(data._id, data);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.cashAmount),
    };
    const newCompany_idData = {
      borrow: Number(company_id.borrow) + Number(data.lendAmount),
      METUbalance: Number(company_id.METUbalance) - Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(data.income, newCompanyData);
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompany_idData);

    const newBuyerData = {
      METUbalance: Number(buyer.METUbalance) + Number(data.metuAmount),
    };
    await Account.findByIdAndUpdate(data.buyer._id, newBuyerData);
    const { _id, ...saleData } = data;
    await Sale.create(saleData);
  }
  return result;
});
