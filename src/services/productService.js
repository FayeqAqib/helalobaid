import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { uploadImage } from "@/lib/uploadImage";
import { Buy } from "@/models/Buy";
import { DepotItems } from "@/models/depotItems";
import { Items } from "@/models/items";
import { Product } from "@/models/product";
import { Sale } from "@/models/Sale";

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

export const getAllProductInBuy = catchAsync(async (filter) => {
  const result = await Product.find({}, { name: 1, brand: 1, companyName: 1 });
  const newResult = await result?.map((item) => {
    return {
      value: item._id,
      label: item.name + "-" + item.brand + "-" + item.companyName,
    };
  });
  return newResult;
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
  const buy = await Buy.findOne({
    "items.product": _id,
  });
  const sale = await Items.findOne({
    product: _id,
  });
  const item = await Sale.findOne({
    "items.product": _id,
  });
  const depotItems = await DepotItems.findOne({
    product: _id,
  });
  if (buy || sale || item || depotItems)
    return {
      message:
        "نمی توانین این عنوان را پاک کنید چون با این عنوان محصول در خرید فروش یا در انبار ثبت شده",
    };
  const result = await Product.findByIdAndDelete(_id);
  return result;
});
