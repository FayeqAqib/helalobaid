"use server";

import { CreateMarquee, DeleteMarquee } from "@/services/marqueeService";
import { revalidatePath } from "next/cache";

export async function createMarqueeAction(id) {
  const result = await CreateMarquee(id);
  return result;
}
export async function deleteMarqueeAction() {
  const result = await DeleteMarquee();
  if (!result.err) {
    revalidatePath("/setting");
  }
  return result;
}
