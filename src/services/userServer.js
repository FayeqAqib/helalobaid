import APIFeatures from "@/lib/apiFeatues";
import { catchAsync } from "@/lib/catchAsync";
import { User } from "@/models/User";

import bcrypt from "bcryptjs";

export const createUser = catchAsync(async (data) => {
  const { username, password, owner, role } = data;

  // const user = await User.find();

  if (!username || !password) {
    return { message: "نام یا رمز عبور وجود ندارد" };
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return { message: "کاربری با این مشخصات وجود دارد ." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    owner,
    role,
    username,
    password: hashedPassword,
  });

  return result;
});

////////////////////////////////////////////////////find user///////////////////////////////////////////////

export const getAllUsers = catchAsync(async (filter) => {
  if (filter.owner) {
    filter.owner = filter.owner.split("_")[1];
  }

  const count = await User.countDocuments();

  const features = new APIFeatures(User.find(), filter)
    .filter()
    .sort()
    .paginate();
  const result = await features.query.populate("owner", "name");

  return { result, count };
});

///////////////////////////////////////////////// DELETE /////////////////////////////////////////////////////////

export const deleteUser = catchAsync(async (_id) => {
  const result = await User.findByIdAndDelete(_id);
  return result;
});

//////////////////////////////////////////UPDATE ////////////////////////////////////////////

export const updateUser = catchAsync(async (data) => {
  const { username, password, _id } = data;

  if (!username || !password) {
    return { message: "نام یا رمز عبور وجود ندارد" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await User.findByIdAndUpdate(_id, {
    username,
    password: hashedPassword,
  });

  return result;
});
