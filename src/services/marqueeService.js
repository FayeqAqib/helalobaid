import { catchAsync } from "@/lib/catchAsync";
import { Marquee } from "@/models/marquee";

export const CreateMarquee = catchAsync(async (text) => {
  const newMarquee = {
    text,
  };
  await Marquee.deleteMany({});
  const result = await Marquee.create(newMarquee);
  return result;
});

export const DeleteMarquee = catchAsync(async (_id) => {
  const result = await Marquee.deleteMany({});
  return result;
});

export const GetMarquee = catchAsync(async () => {
  const result = await Marquee.find({}, { _id: 0 });
  return result;
});
