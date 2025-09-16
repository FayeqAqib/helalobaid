import APIFeatures from "@/lib/apiFeatues";
import { Items } from "@/models/items";
import { ProductTransfer } from "@/models/ProductTransfer";

const { catchAsync } = require("@/lib/catchAsync");

export const createProductTransfer = catchAsync(async (data) => {
  const from = await Items.findOne({
    product: data.product,
    unit: data.unit,
    depot: data.from,
    count: { $gt: 0 },
  }).lean();
  const to = await Items.findOne({
    product: data.product,
    unit: data.unit,
    depot: data.to,
  });

  if (from.count < Number(data.count))
    return { message: "شما نمی توانین بیشتر از تعداد موجود انتقال دهید" };

  await Items.findByIdAndUpdate(from._id, {
    $inc: { count: -data.count },
  });

  if (to) {
    await Items.findByIdAndUpdate(to._id, { $inc: { count: data.count } });
  } else {
    const { _id, count, depot, ...myData } = from;
    await Items.create({ ...myData, count: data.count, depot: data.to });
  }

  const result = await ProductTransfer.create({ ...data, unit: data.unit });
  return result;
});

export const getAllProducttransfer = catchAsync(async (filter) => {
  const count = await ProductTransfer.countDocuments();
  const features = new APIFeatures(ProductTransfer.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate(
    ["from", "to", "product"],
    "name"
  );

  return { result, count };
});

export const deleteProductTransfer = catchAsync(async (data) => {
  const doc = await ProductTransfer.findById(data._id);
  const to = await Items.findOne({
    product: data.product._id,
    unit: data.unit,
    depot: data.to._id,
  });

  if (to.count < data.count)
    return { message: "شما نمی توانین بیشتر از تعداد موجود حذف دهید" };

  await Items.findByIdAndUpdate(doc._id, {
    $inc: { count: data.count },
  });

  await Items.findByIdAndUpdate(doc._id, { $inc: { count: -data.count } });

  const result = await ProductTransfer.findByIdAndDelete(data._id);
  return result;
});
