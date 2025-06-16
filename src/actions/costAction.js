"use server";

import { createCost, deleteCost, updateCost } from "@/services/costService";
import { revalidatePath } from "next/cache";

export default async function createcostAction(data) {
  const result = await createCost(data);
  if (!result.err) {
    revalidatePath("/cost");
    revalidatePath("/home");
  }
  return result;
}

export async function deleteCostAction(data) {
  const result = await deleteCost(data);
  if (!result.err) {
    revalidatePath("/cost");
    revalidatePath("/home");
  }
  return result;
}

export async function updateCostAction(currentData, newData) {
  const result = await updateCost({ currentData, newData });
  if (!result.err) {
    revalidatePath("/cost");
    revalidatePath("/home");
  }
  return result;
}
