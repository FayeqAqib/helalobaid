import { catchAsync } from "@/lib/catchAsync";
import { Currency } from "@/models/Currency";

export const createCurrency = catchAsync(
  async (data) => await Currency.create(data)
);

export const deleteCurrency = catchAsync(async (id) => {
  const result = await Currency.findByIdAndDelete(id);
  return result;
});

export const updateCurrency = catchAsync(
  async (data) => await Currency.findByIdAndUpdate(data._id, data)
);

export const findCurrency = catchAsync(async () => await Currency.find());
