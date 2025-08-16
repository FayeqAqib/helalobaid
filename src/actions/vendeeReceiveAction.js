"use server";

import {
  createReceive,
  deleteReceive,
  updateReceive,
} from "@/services/vendeeReceiveService";
import { revalidatePath } from "next/cache";

export async function createVendeeReceiveAction(data) {
  const result = await createReceive(data);

  if (!result.err) {
    revalidatePath("/vendee/receive");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function deleteVendeeReceiveAction(data) {
  const result = await deleteReceive(data);

  if (!result.err) {
    revalidatePath("/vendee/receive");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function updateVendeeReceiveAction(currentData, newData) {
  const result = await updateReceive({ currentData, newData });

  if (!result.err) {
    revalidatePath("/vendee/receive");
    revalidatePath("/vendee/home");
  }
  return result;
}
