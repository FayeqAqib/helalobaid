import { catchAsync } from "@/lib/catchAsync";

import { Items } from "@/models/items";

export const getAllPOSItems = catchAsync(async () => {
  const result = Items.find({ count: { $gt: 0 } })
    .populate(["unit", "depot"], "name")
    .populate("product", ["name", "image"]);

  return result;
});
//
