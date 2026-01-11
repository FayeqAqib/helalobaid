import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { uploadImage } from "@/lib/uploadImage";
import { Buy } from "@/models/Buy";
import { Depot } from "@/models/depot";
import { DepotItems } from "@/models/depotItems";
import { Sale } from "@/models/Sale";

//////////////////////////// CREATE ///////////////////////////////////////
export const createDepot = catchAsync(async (data) => {
  const newData = { ...data };
  if (typeof data.image === "object") {
    const { path, err } = await uploadImage(data.image);
    newData.image = path;

    if (err) {
      return {
        message:
          "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
      };
    }
  } else {
    delete newData.image;
  }
  const result = await Depot.create(newData);
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllDepot = catchAsync(async (filter) => {
  const count = await Depot.countDocuments();
  const features = new APIFeatures(Depot.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});

//////////////////////////// UPDATE ///////////////////////////////
export const updateDepot = catchAsync(async (data) => {
  const newData = { ...data };
  if (typeof data.image === "object") {
    const { path, err } = await uploadImage(data.image);
    newData.image = path;

    if (err) {
      return {
        message:
          "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
      };
    }
  } else {
    delete newData.image;
  }
  const result = await Depot.findByIdAndUpdate(data._id, newData);

  return result;
});

////////////////////////////DELETE ////////////////////////////
export const deleteDepot = catchAsync(async (_id) => {
  const buy = Buy.findOne({ "items.depot": _id }, { _id: 1 });
  const sale = Sale.findOne({ "items.depot": _id }, { _id: 1 });
  const depot = DepotItems.findOne({ depot: _id }, { _id: 1 });

  if (buy || sale || depot) {
    return {
      message: "حدف گدام ممکن نیست جون این گدام در معامله ای در سیستم درج شده",
    };
  }
  const result = await Depot.findByIdAndDelete(_id);
  return result;
});
