"use server";

import { createTransfer, deleteTransfer } from "@/services/transferService";
import { revalidatePath } from "next/cache";

export async function createTransferAction(data) {
  const result = await createTransfer(data);

  if (!result.err) {
    revalidatePath("/customer/transfer");
    revalidatePath("/customer/home");
  }
  return result;
}

export async function deleteTransferAction(data) {
  const result = await deleteTransfer(data);

  if (!result.err) {
    revalidatePath("/customer/transfer");
    revalidatePath("/customer/home");
  }
  return result;
}
