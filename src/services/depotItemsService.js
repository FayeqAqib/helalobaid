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

  let dataID;

  const up = await Items.findOne({
    depot: newData.depot,
    product: newData.product,
    unit: newData.unit,
    badgeNumber: newData.badgeNumber,
  });
  if (up) {
    const totalCount =
      up.count + newData.count === 0 ? 1 : up.count + newData.count;
    dataID = await Items.findByIdAndUpdate(up._id, {
      $inc: { count: newData.count },
      $set: {
        aveUnitAmount:
          (up.aveUnitAmount * up.count +
            newData.aveUnitAmount * newData.count) /
          totalCount,
        saleAmount:
          (up.saleAmount * up.count + newData.saleAmount * newData.count) /
          totalCount,
      },
    });
  } else {
    dataID = await Items.create(data);
  }

  // const dataID = await Items.create(newData);

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
export const updateDepotItems = catchAsync(async ({ oldData, newData }) => {
  if (typeof newData.image === "object") {
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

  ////////////////////////////////////////////////////   REMOVE OLD iTEMS /////////////////////////////////////////////
  const up = await Items.findOne({
    depot: oldData.depot?._id,
    product: oldData.product._id,
    unit: oldData.unit._id,
    badgeNumber: oldData.badgeNumber,
  });
  if (up) {
    console.log(typeof up, up, "null", null);
    const totalCount =
      up.count - oldData.count === 0 ? 1 : up.count - oldData.count;
    await Items.findByIdAndUpdate(up._id, {
      $inc: { count: -oldData.count },
      $set: {
        aveUnitAmount:
          (up.aveUnitAmount * up.count -
            oldData.aveUnitAmount * oldData.count) /
          totalCount,
        saleAmount:
          (up.saleAmount * up.count - oldData.saleAmount * oldData.count) /
          totalCount,
      },
    });
  }

  ////////////////////////////////////////////////////    ADD NEW iTEMS /////////////////////////////////////////////

  const up2 = await Items.findOne({
    depot: newData.depot,
    product: newData.product,
    unit: newData.unit,
    badgeNumber: newData.badgeNumber,
  });

  if (up2) {
    const totalCount =
      up2.count + newData.count === 0 ? 1 : up2.count + newData.count;
    await Items.findByIdAndUpdate(up2._id, {
      $inc: { count: newData.count },
      $set: {
        aveUnitAmount:
          (up2.aveUnitAmount * up2.count +
            newData.aveUnitAmount * newData.count) /
          totalCount,
        saleAmount:
          (up2.saleAmount * up2.count + newData.saleAmount * newData.count) /
          totalCount,
      },
    });
  } else {
    await Items.create(newData);
  }

  // await Items.findByIdAndUpdate(data.item, newData);

  const result = await DepotItems.findByIdAndUpdate(oldData._id, newData);

  return result;
});

////////////////////////////DELETE ////////////////////////////

export const deleteDepotItems = catchAsync(async (data) => {
  const up = await Items.findOne({
    depot: data.depot._id,
    product: data.product._id,
    unit: data.unit._id,
    badgeNumber: data.badgeNumber,
  });
  if (up) {
    const totalCount = up.count - data.count === 0 ? 1 : up.count - data.count;

    await Items.findByIdAndUpdate(up._id, {
      $inc: { count: -data.count },
      $set: {
        aveUnitAmount:
          (up.aveUnitAmount * up.count - data.aveUnitAmount * data.count) /
          totalCount,
        saleAmount:
          (up.saleAmount * up.count - data.saleAmount * data.count) /
          totalCount,
      },
    });
  }
  // await Items.findByIdAndDelete(data.item);
  const result = await DepotItems.findByIdAndDelete(data._id);
  return result;
});
