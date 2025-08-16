"use server";

import {
  createApplecation,
  deleteApplecation,
  updateApplecation,
} from "@/services/applecationService";
import { revalidatePath } from "next/cache";

export default async function createApplecationAction(data) {
  const result = await createApplecation(data);
  if (!result.err) {
    revalidatePath("customer/applecation");
    revalidatePath("customer/home");
  }
  return result;
}

export async function updateApplecationAction(data) {
  const result = await updateApplecation(data);
  if (!result.err) {
    revalidatePath("customer/applecation");
    revalidatePath("customer/home");
  }
  return result;
}
export async function deleteApplecationAction(data) {
  const result = await deleteApplecation(data);
  if (!result.err) {
    revalidatePath("customer/applecation");
    revalidatePath("customer/home");
  }
  return result;
}
