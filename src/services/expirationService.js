import { catchAsync } from "@/lib/catchAsync";
import { Expiration } from "@/models/expiration";

export const createExpiration = catchAsync(async (data) => {
  await Expiration.deleteMany();

  const result = await Expiration.create({
    expiring: data.expiring,
    count: data.count,
  });

  return result;
});

export const findExpiration = catchAsync(async () => {
  const result = await Expiration.findOne();

  return result;
});
