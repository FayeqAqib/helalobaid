import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Unit } from "@/models/unit";
//////////////////////////// CREATE ///////////////////////////////////////
export const createUnit = catchAsync(async (data) => {
  const result = await Unit.create(data);
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllUnit = catchAsync(async (filter) => {
  const count = await Unit.countDocuments();
  const features = new APIFeatures(Unit.find(), filter)
    .filter()
    .sort()
    .paginate()
    .limitFields();
  const result = await features.query;
  return { result, count };
});

//////////////////////////// UPDATE ///////////////////////////////
export const updateUnit = catchAsync(async (data) => {
  const result = await Unit.findByIdAndUpdate(data._id, data);

  return result;
});

////////////////////////////DELETE ////////////////////////////
export const deleteUnit = catchAsync(async (_id) => {
  const result = await Unit.findByIdAndDelete(_id);
  return result;
});
