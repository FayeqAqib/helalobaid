import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Account } from "@/models/account";
import { Receive } from "@/models/receive";

export const createReceive = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    borrow: 1,
  });
  const buyer = await Account.findById(data.buyer, {
    lend: 1,
  });

  if (company.borrow < data.amount)
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${company.borrow} می باشد`,
    };
  const result = await Receive.create(data);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) + Number(data.amount),
      borrow: Number(company.borrow) - Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.amount >= 1) {
      const newbuyerData = {
        lend: Number(buyer.lend) - Number(data.amount),
      };
      await Account.findByIdAndUpdate(data.buyer, newbuyerData);
    }
  }
  return result;
});

export const getAllReceive = catchAsync(async (filter) => {
  if (filter.buyer) {
    filter.buyer = await Account.findOne({ name: filter.buyer }, { _id: 1 });
  }
  const count = await Receive.countDocuments();
  const features = new APIFeatures(Receive.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("buyer", "name");

  return { result, count };
});

export const deleteReceive = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    borrow: 1,
  });
  const buyer = await Account.findById(data.buyer, {
    lend: 1,
  });

  if (company.balance < data.amount)
    return {
      message: `برای پرداخت  در حساب  بیلانس کافی ندارید بیلانس شما${company.balance} می باشد`,
    };

  const result = await Receive.findByIdAndDelete(data._id);

  if (result?._id) {
    const newCompanyData = {
      balance: Number(company.balance) - Number(data.amount),
      borrow: Number(company.borrow) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
    if (data.amount >= 1) {
      const newbuyerData = {
        lend: Number(buyer.lend) + Number(data.amount),
      };
      await Account.findByIdAndUpdate(data.buyer, newbuyerData);
    }
  }
  return result;
});

/////////////////////////////////////////////////// update ///////////////////////////////////////////

export const updateReceive = catchAsync(async ({ currentData, newData }) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
    borrow: 1,
  });
  const newBuyer = await Account.findById(newData.buyer, {
    lend: 1,
    _id: 0,
  });

  if (newBuyer.lend < newData.amount)
    return {
      message: `پول درج شده بیشر از مقدار پول مورد نظر میباشد، لطفا نموده در درج مقدار پول توجه بیشتر به خرچ دهید. طلب  شما از  مشتری   ${company.borrow} می باشد`,
    };

  if (currentData.buyer !== newData.buyer) {
    const currentBuyer = await Account.findById(currentData.buyer, {
      lend: 1,
      _id: 0,
    });
    currentBuyer.lend = Number(currentBuyer.lend) + Number(currentData.amount);
    newBuyer.lend = Number(newBuyer.lend) - Number(newData.amount);

    await Account.findByIdAndUpdate(newData.buyer, newBuyer);
    await Account.findByIdAndUpdate(currentData.buyer, currentBuyer);
  } else {
    newBuyer.lend = Number(newData.amount);

    await Account.findByIdAndUpdate(newData.buyer, newBuyer);
  }

  const result = await Receive.findByIdAndUpdate(currentData._id, newData);

  if (result?._id) {
    const newCompanyData = {
      balance:
        Number(company.balance) +
        (Number(currentData.amount) - Number(newData.amount)),
      borrow:
        Number(company.borrow) -
        (Number(currentData.amount) - Number(newData.amount)),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newCompanyData);
  }

  return result;
});
