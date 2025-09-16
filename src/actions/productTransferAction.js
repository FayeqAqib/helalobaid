"use server";

import {
  createProductTransfer,
  deleteProductTransfer,
} from "@/services/productTransfer";
import { deleteTransfer } from "@/services/transferService";
import { revalidatePath } from "next/cache";

export async function createProductTransferAction(data) {
  const result = await createProductTransfer(data);

  if (!result.err) {
    revalidatePath("/customer/productTransfer");
  }
  return result;
}

export async function deleteProductTransferAction(data) {
  const result = await deleteProductTransfer(data);

  if (!result.err) {
    revalidatePath("/customer/productTransfer");
  }
  return result;
}
