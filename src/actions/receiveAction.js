"use server";

import {
  createReceive,
  deleteReceive,
  updateReceive,
} from "@/services/receiveService";
import { revalidatePath } from "next/cache";

export async function createReceiveAction(data) {
  const result = await createReceive(data);

  if (!result.err) {
    revalidatePath("/receive");
    revalidatePath("/home");
  }
  return result;
}

export async function deleteReceiveAction(data) {
  const result = await deleteReceive(data);

  if (!result.err) {
    revalidatePath("/receive");
    revalidatePath("/home");
  }
  return result;
}

export async function updateReceiveAction(currentData, newData) {
  const result = await updateReceive({ currentData, newData });

  if (!result.err) {
    revalidatePath("/receive");
    revalidatePath("/home");
  }
  return result;
}
