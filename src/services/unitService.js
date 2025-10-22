import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { Buy } from "@/models/Buy";
import { DepotItems } from "@/models/depotItems";
import { Items } from "@/models/items";
import { Sale } from "@/models/Sale";
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
  const buy = await Buy.findOne({
    "items.unit": _id,
  });
  const sale = await Items.findOne({
    unit: _id,
  });
  const item = await Sale.findOne({
    "items.unit": _id,
  });
  const depotItems = await DepotItems.findOne({
    unit: _id,
  });
  if (buy || sale || item || depotItems)
    return {
      message:
        "نمی توانین این عنوان را پاک کنید چون با این عنوان محصول در خرید فروش یا در انبار ثبت شده",
    };
  const result = await Unit.findByIdAndDelete(_id);
  return result;
});
