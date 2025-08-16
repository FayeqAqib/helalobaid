import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Receive } from "@/models/receive";

export const getAllPay = catchAsync(async (filter, owner) => {
  filter.type = owner;
  console.log(filter);
  const count = await Receive.countDocuments();
  const features = new APIFeatures(Receive.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("type", "name");
  console.log(result);
  return { result, count };
});
