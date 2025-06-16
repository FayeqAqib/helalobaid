import { catchAsync } from "@/lib/catchAsync";
import { User } from "@/models/User";

import bcrypt from "bcryptjs";

export const createUser = catchAsync(async (data) => {
  const { username, password, securityCod } = data;
  // if (securityCod !== process.env.MY_CODE)
  //   return { message: "فقد ادمین میتواند حساب کاربری ایجاد کند" };
  const user = await User.find();

  if (!username || !password) {
    return { message: "نام یا رمز عبور وجود ندارد" };
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return { message: "کاربری با این مشخصات وجود دارد ." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await User.create({
    username,
    password: hashedPassword,
  });
  return result;
});
