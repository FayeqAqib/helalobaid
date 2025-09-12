"use server";

import { getListOfItems } from "@/services/itemsService";

export async function getListOfItemsActions() {
  return await getListOfItems();
}
