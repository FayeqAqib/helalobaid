"use server";

import {
  createDepot,
  deleteDepot,
  getAllDepot,
  updateDepot,
} from "@/services/depotService";
import { revalidatePath } from "next/cache";

////////////////////////////////////////// CREATE ///////////////////////////////////////////////////////
export default async function createDepotAction(data) {
  const result = await createDepot(data);

  if (!result.err) {
    revalidatePath("createDepot");
  }
  return result;
}

/////////////////////////////////////// UPDATE /////////////////////////////////////////////
export async function updateDepotAction(data) {
  const result = await updateDepot(data);

  if (!result.err) {
    revalidatePath("createDepot");
  }
  return result;
}

////////////////////////////////////////// DELETE ////////////////////////////////////////////
export async function deleteDepotAction(data) {
  const result = await deleteDepot(data);

  if (!result.err) {
    revalidatePath("createDepot");
  }
  return result;
}
////////////////////////////////////////////// GET ///////////////////////////////////////////////
export async function getAllDepotAction() {
  const result = await getAllDepot({ fields: "name" });

  return result.result;
}
