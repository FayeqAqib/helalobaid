"use server";

import {
  createSale,
  deleteSale,
  updateSale,
} from "@/services/vendeeSaleServer";
import { revalidatePath } from "next/cache";

export default async function createVendeeSaleAction(data) {
  const result = await createSale(data);

  if (!result.err) {
    revalidatePath("/vendee/sale");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function deleteVendeeSaleAction(data) {
  const result = await deleteSale(data);
  if (!result.err) {
    revalidatePath("/vendee/sale");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function updateVendeeSaleAction(currentData, newData) {
  const result = await updateSale({ currentData, newData });

  if (!result.err) {
    revalidatePath("/vendee/sale");
    revalidatePath("/vendee/home");
  }
  return result;
}
