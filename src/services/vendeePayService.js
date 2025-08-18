import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Receive } from "@/models/receive";

export const getAllPay = catchAsync(async (filter, owner) => {
  filter.type = owner;

  const count = await Receive.countDocuments();
  const features = new APIFeatures(Receive.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("type", "name");

  return { result, count };
});
