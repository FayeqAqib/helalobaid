import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { uploadImage } from "@/lib/uploadImage";
import { Product } from "@/models/product";

//////////////////////////// CREATE ///////////////////////////////////////
export const createProduct = catchAsync(async (data) => {
  const newData = { ...data };
  const { path, err } = await uploadImage(data.image);
  newData.image = path;

  if (err) {
    return {
      message:
        "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
    };
  }
  const result = await Product.create(newData);
  return result;
});

////////////////////////////////////////////////// find ////////////////////////////////////////////////

export const getAllProduct = catchAsync(async (filter) => {
  const count = await Product.countDocuments();
  const features = new APIFeatures(Product.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query;
  return { result, count };
});

//////////////////////////// UPDATE ///////////////////////////////
export const updateProduct = catchAsync(async (data) => {
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

  const result = await Product.findByIdAndUpdate(data._id, newData);
  return result;
});

////////////////////////////DELETE ////////////////////////////
export const deleteProduct = catchAsync(async (_id) => {
  const result = await Product.findByIdAndDelete(_id);
  return result;
});
