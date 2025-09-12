"use server";

import {
  createCostTital,
  deleteCostTital,
  getAllCostTital,
  updateCostTital,
} from "@/services/costTitalService";

import { revalidatePath, revalidateTag } from "next/cache";

////////////////////////////////////////// CREATE ///////////////////////////////////////////////////////
export default async function createCostTitalAction(data) {
  const result = await createCostTital(data);

  if (!result.err) {
    revalidateTag("costTital");
  }
  return result;
}

/////////////////////////////////////// UPDATE /////////////////////////////////////////////
export async function updateCostTitalAction(data) {
  const result = await updateCostTital(data);

  if (!result.err) {
    revalidateTag("costTital");
  }
  return result;
}

////////////////////////////////////////// DELETE ////////////////////////////////////////////
export async function deleteCostTitalAction(data) {
  const result = await deleteCostTital(data);

  if (!result.err) {
    revalidateTag("costTital");
  }
  return result;
}

////////////////////////////////////////////// GET ///////////////////////////////////////////////
export async function getAllCostTitalAction() {
  const result = await getAllCostTital({ fields: "name" });

  return result.result;
}
