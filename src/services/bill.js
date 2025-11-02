import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Bill } from "@/models/billHeaderAndFooter";

const { catchAsync } = require("@/lib/catchAsync");

export const findBills = catchAsync(async () => {
  const result = await Bill.findOne();
  return result;
});
