import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { FinancialAccount } from "@/models/FinancialAccount";

export const getFinantial = catchAsync(async (filter) => {
  if (filter?.name && filter?.date) {
    filter.name = filter.name.split("_")[1];

    const features = new APIFeatures(FinancialAccount.find(), filter)
      .filter()
      .sort()
      .paginate();

    const result = await features.query.populate("name", "name");
    return { result, count: 0 };
  }

  return { result: [], count: 0 };
});
