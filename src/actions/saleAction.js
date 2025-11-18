"use server";

import { getAllPOSItems } from "@/services/posSaleService";
import { createSale, deleteSale, updateSale } from "@/services/saleService";
import { revalidatePath } from "next/cache";

export default async function createSaleAction(data) {
  const result = await createSale(data);

  if (!result.err) {
    revalidatePath("/sale");
    revalidatePath("/home");
  }
  return result;
}

export async function getAllPOSItemsAction() {
  const result = await getAllPOSItems();
  return result;
}

export async function deleteSaleAction(data) {
  const result = await deleteSale(data);
  if (!result.err) {
    revalidatePath("/sale");
    revalidatePath("/home");
  }
  return result;
}

export async function updateSaleAction(currentData, newData) {
  const result = await updateSale({ currentData, newData });

  if (!result.err) {
    revalidatePath("/sale");
    revalidatePath("/home");
  }
  return result;
}
