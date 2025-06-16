"use server";

import {
  createExternalProceed,
  deleteExternalProceed,
  updateExternalProceed,
} from "@/services/externalProceedService";
import { revalidatePath } from "next/cache";

export default async function createExternalProceedAction(data) {
  const result = await createExternalProceed(data);
  if (!result.err) {
    revalidatePath("/externalProceed");
    revalidatePath("/home");
  }
  return result;
}

export async function deleteExternalProceedAction(data) {
  const result = await deleteExternalProceed(data);
  if (!result.err) {
    revalidatePath("/externalProceed");
    revalidatePath("/home");
  }
  return result;
}

export async function updateExternalProceedAction(currentData, newData) {
  const result = await updateExternalProceed({ currentData, newData });
  if (!result.err) {
    revalidatePath("/externalProceed");
    revalidatePath("/home");
  }
  return result;
}
