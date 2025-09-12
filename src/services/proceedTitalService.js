import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { ProceedTital } from "@/models/ProceedTital";
import { Unit } from "@/models/unit";
//////////////////////////// CREATE ///////////////////////////////////////
export const createProceedTital = catchAsync(async (data) => {
  const result = await ProceedTital.create(data);
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllProceedTital = catchAsync(async (filter) => {
  const count = await ProceedTital.countDocuments();
  const features = new APIFeatures(ProceedTital.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});

//////////////////////////// UPDATE ///////////////////////////////
export const updateProceedTital = catchAsync(async (data) => {
  const result = await ProceedTital.findByIdAndUpdate(data._id, data);

  return result;
});

////////////////////////////DELETE ////////////////////////////
export const deleteProceedTital = catchAsync(async (_id) => {
  const result = await ProceedTital.findByIdAndDelete(_id);
  return result;
});
