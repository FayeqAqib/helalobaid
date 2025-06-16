import { catchAsync } from "@/lib/catchAsync";
import { ExternalProceed } from "@/models/externalProceed";
import { Account } from "@/models/account";
import APIFeatures from "@/lib/apiFeatues";

export const createExternalProceed = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
  });

  const result = await ExternalProceed.create(data);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) + Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newBalance);
  }
  return result;
});

export const getAllExternalProceed = catchAsync(async (filter) => {
  const count = await ExternalProceed.countDocuments();
  const features = new APIFeatures(ExternalProceed.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});

export const deleteExternalProceed = catchAsync(async (data) => {
  const company = await Account.findById(process.env.COMPANY_ID, {
    balance: 1,
  });
  if (company.balance < data.amount)
    return {
      message: `شما بیلانس کافی برای پرداخت ندارید بیلانس شما ${company.balance}  می باشد `,
    };

  const result = await ExternalProceed.findByIdAndDelete(data._id);
  if (result._id) {
    const newBalance = {
      balance: Number(company.balance) - Number(data.amount),
    };
    await Account.findByIdAndUpdate(process.env.COMPANY_ID, newBalance);
  }
  return result;
});

////////////////////////////////////////////////// update ////////////////////////////////////////////////

export const updateExternalProceed = catchAsync(
  async ({ currentData, newData }) => {
    const company = await Account.findById(process.env.COMPANY_ID, {
      balance: 1,
    });

    const result = await ExternalProceed.findByIdAndUpdate(
      currentData,
      newData
    );
    if (result._id) {
      const newBalance = {
        balance:
          Number(company.balance) -
          (Number(currentData.amount) - Number(newData.amount)),
      };
      await Account.findByIdAndUpdate(process.env.COMPANY_ID, newBalance);
    }
    return result;
  }
);
