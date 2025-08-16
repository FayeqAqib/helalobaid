//

import Signup from "@/components/myUI/signup";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const user = await auth();
  if (user?.role !== "admin") redirect("/customer/home");
  return <Signup />;
};

export default page;
