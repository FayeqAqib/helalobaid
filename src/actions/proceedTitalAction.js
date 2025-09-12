"use server";

import {
  createProceedTital,
  deleteProceedTital,
  getAllProceedTital,
  updateProceedTital,
} from "@/services/proceedTitalService";
import { revalidateTag } from "next/cache";

////////////////////////////////////////// CREATE ///////////////////////////////////////////////////////
export default async function createProceedTitalAction(data) {
  const result = await createProceedTital(data);

  if (!result.err) {
    revalidateTag("proceedTital");
  }
  return result;
}

/////////////////////////////////////// UPDATE /////////////////////////////////////////////
export async function updateProceedTitalAction(data) {
  const result = await updateProceedTital(data);

  if (!result.err) {
    revalidateTag("proceedTital");
  }
  return result;
}

////////////////////////////////////////// DELETE ////////////////////////////////////////////
export async function deleteProceedTitalAction(data) {
  const result = await deleteProceedTital(data);

  if (!result.err) {
    revalidateTag("proceedTital");
  }
  return result;
}

////////////////////////////////////////////// GET ///////////////////////////////////////////////
export async function getAllProceedTitalAction() {
  const result = await getAllProceedTital({ fields: "name" });

  return result.result;
}
