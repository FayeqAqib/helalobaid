"use server";

import {
  createDepotItems,
  deleteDepotItems,
  getAllDepotItems,
  updateDepotItems,
} from "@/services/depotItemsService";
// import {
//   createDepotItems,
//   deleteDepotItems,
//   getAllDepotItems,
//   getOneDepotItems,
//   updateDepotItems,
// } from "@/services/depotItemsService";

import { revalidatePath } from "next/cache";

////////////////////////////////////////// CREATE ///////////////////////////////////////////////////////
export default async function createDepotItemsAction(data) {
  const result = await createDepotItems(data);

  if (!result.err) {
    revalidatePath("depotInventory");
  }
  return result;
}

/////////////////////////////////////// UPDATE /////////////////////////////////////////////
export async function updateDepotItemsAction(data) {
  const result = await updateDepotItems(data);

  if (!result.err) {
    revalidatePath("depotInventory");
  }
  return result;
}

////////////////////////////////////////// DELETE ////////////////////////////////////////////
export async function deleteDepotItemsAction(data) {
  const result = await deleteDepotItems(data);

  if (!result.err) {
    revalidatePath("depotInventory");
  }
  return result;
}
////////////////////////////////////////////// GET ALL ///////////////////////////////////////////////
export async function getAllDepotItemsAction() {
  const result = await getAllDepotItems({ fields: "name" });

  return result.result;
}
////////////////////////////////////////////// GET ONE ///////////////////////////////////////////////
// export async function getOneDepotItemsAction(_id) {
//   const result = await getOneDepotItems(_id);

//   return result.result;
// }
