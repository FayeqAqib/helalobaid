import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { uploadImage } from "@/lib/uploadImage";
import { Depot } from "@/models/depot";
import { DepotItems } from "@/models/depotItems";
import { Items } from "@/models/items";

//////////////////////////// CREATE ///////////////////////////////////////
export const createDepotItems = catchAsync(async (data) => {
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

  const dataID = await Items.create(newData);

  const result = await DepotItems.create({
    ...newData,
    item: dataID._id,
  });
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllDepotItems = catchAsync(async (filter) => {
  const count = await DepotItems.countDocuments();
  const features = new APIFeatures(DepotItems.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(
    ["depot", "product", "unit"],
    "name"
  );
  return { result, count };
});

//////////////////////////// UPDATE ///////////////////////////////
export const updateDepotItems = catchAsync(async (data) => {
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
  await Items.findByIdAndUpdate(data.item, newData);

  const result = await DepotItems.findByIdAndUpdate(data._id, newData);

  return result;
});

////////////////////////////DELETE ////////////////////////////

export const deleteDepotItems = catchAsync(async (data) => {
  await Items.findByIdAndDelete(data.item);
  const result = await DepotItems.findByIdAndDelete(data._id);
  return result;
});
