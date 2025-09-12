import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { CostTital } from "@/models/constTital";

//////////////////////////// CREATE ///////////////////////////////////////
export const createCostTital = catchAsync(async (data) => {
  const result = await CostTital.create(data);
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllCostTital = catchAsync(async (filter) => {
  const count = await CostTital.countDocuments();
  const features = new APIFeatures(CostTital.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});

//////////////////////////// UPDATE ///////////////////////////////
export const updateCostTital = catchAsync(async (data) => {
  const result = await CostTital.findByIdAndUpdate(data._id, data);

  return result;
});

////////////////////////////DELETE ////////////////////////////
export const deleteCostTital = catchAsync(async (_id) => {
  const result = await CostTital.findByIdAndDelete(_id);
  return result;
});
