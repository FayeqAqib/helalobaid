"use server";

import { getListOfItems } from "@/services/itemsService";

export async function getListOfItemsActions(filter) {
  console.log(filter, "action");
  return await getListOfItems(filter);
}
