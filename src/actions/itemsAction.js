"use server";

import { getListOfItems } from "@/services/itemsService";

export async function getListOfItemsActions(filter) {
  return await getListOfItems(filter);
}
