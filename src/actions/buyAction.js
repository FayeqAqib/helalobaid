"use server";

import { createBuy, deleteBuy, updateBuy } from "@/services/buyService";
import { revalidatePath } from "next/cache";

export default async function CreateBuyAction(data) {
  const result = await createBuy(data);
  if (!result.err) {
    revalidatePath("/buy");
    revalidatePath("/home");
  }
  return result;
}

export async function deleteBuyAction(data) {
  const result = await deleteBuy(data);
  if (!result.err) {
    revalidatePath("/buy");
    revalidatePath("/home");
  }
  return result;
}
export async function updateBuyAction(currentData, newData) {
  const result = await updateBuy({ currentData, newData });
  if (!result.err) {
    revalidatePath("/buy");
    revalidatePath("/home");
  }
  return result;
}
