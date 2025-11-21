import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { CostTital } from "@/models/constTital";
import { Cost } from "@/models/cost";

//////////////////////////// CREATE ///////////////////////////////////////

export const createCostTital = catchAsync(async (data) => {
  const result = await CostTital.create(data);
  return result;
});

////////////////////////////////////////////////// FIND  ////////////////////////////////////////////////

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
  const exiset = await Cost.findOne({
    costTital: _id,
  });
  if (exiset)
    return {
      message: "نمی توانین این عنوان را پاک کنید چون با این عنوان مصارفی ثبت",
    };
  const result = await CostTital.findByIdAndDelete(_id);
  return result;
});
