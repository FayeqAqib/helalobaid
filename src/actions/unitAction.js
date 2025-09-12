"use server";

import {
  createUnit,
  deleteUnit,
  getAllUnit,
  updateUnit,
} from "@/services/unitService";
import { revalidateTag } from "next/cache";

////////////////////////////////////////// CREATE ///////////////////////////////////////////////////////
export default async function createUnitAction(data) {
  const result = await createUnit(data);

  if (!result.err) {
    revalidateTag("unit");
  }
  return result;
}

/////////////////////////////////////// UPDATE /////////////////////////////////////////////
export async function updateUnitAction(data) {
  const result = await updateUnit(data);

  if (!result.err) {
    revalidateTag("unit");
  }
  return result;
}

////////////////////////////////////////// DELETE ////////////////////////////////////////////
export async function deleteUnitAction(data) {
  const result = await deleteUnit(data);

  if (!result.err) {
    revalidateTag("unit");
  }
  return result;
}
////////////////////////////////////////////// GET ///////////////////////////////////////////////
export async function getAllUnitAction() {
  const result = await getAllUnit({ fields: "name" });

  return result.result;
}
