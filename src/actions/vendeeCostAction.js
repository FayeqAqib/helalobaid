"use server";

import {
  createCost,
  deleteCost,
  updateCost,
} from "@/services/vendeeCostService";
import { revalidatePath } from "next/cache";

export default async function createVendeeCostAction(data) {
  const result = await createCost(data);
  if (!result.err) {
    revalidatePath("/vendee/cost");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function deleteVendeeCostAction(data) {
  const result = await deleteCost(data);
  if (!result.err) {
    revalidatePath("/vendee/cost");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function updateVendeeCostAction(currentData, newData) {
  const result = await updateCost({ currentData, newData });
  if (!result.err) {
    revalidatePath("/vendee/cost");
    revalidatePath("/vendee/home");
  }
  return result;
}
