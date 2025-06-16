"use server";

import { createPay, deletePay, updatePay } from "@/services/payService";
import { revalidatePath } from "next/cache";

export async function createPayAction(data) {
  const result = await createPay(data);
  if (!result.err) {
    revalidatePath("/pay");
    revalidatePath("/home");
  }
  return result;
}

export async function deletePayAction(data) {
  const result = await deletePay(data);
  if (!result.err) {
    revalidatePath("/pay");
    revalidatePath("/home");
  }
  return result;
}

export async function updatePayAction(currentData, newData) {
  const result = await updatePay({ currentData, newData });
  if (!result.err) {
    revalidatePath("/pay");
    revalidatePath("/home");
  }
  return result;
}
