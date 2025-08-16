"use server";

import {
  createExternalProceed,
  deleteExternalProceed,
  updateExternalProceed,
} from "@/services/vendeeExternalProceedService";
import { revalidatePath } from "next/cache";

export default async function createVendeeExternalProceedAction(data) {
  const result = await createExternalProceed(data);
  if (!result.err) {
    revalidatePath("/vendee/externalProceed");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function deleteVendeeExternalProceedAction(data) {
  const result = await deleteExternalProceed(data);
  if (!result.err) {
    revalidatePath("/vendee/externalProceed");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function updateVendeeExternalProceedAction(currentData, newData) {
  const result = await updateExternalProceed({ currentData, newData });
  if (!result.err) {
    revalidatePath("/vendee/externalProceed");
    revalidatePath("/vendee/home");
  }
  return result;
}
