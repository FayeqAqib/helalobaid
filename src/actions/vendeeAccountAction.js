"use server";

import {
  createAccount,
  deleteAccount,
  getAllBuyer,
  updateAccount,
} from "@/services/vendeeAccountService";
import { revalidatePath } from "next/cache";

export default async function createVendeeAccountAction(data) {
  const result = await createAccount(data);

  if (!result.err) {
    revalidatePath("/vendee/register");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function updateVendeeAccountAction(data) {
  const result = await updateAccount(data);
  if (!result.err) {
    revalidatePath("/vendee/register");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function deleteVendeeAccountAction(data) {
  const result = await deleteAccount(data);
  if (!result.err) {
    revalidatePath("/vendee/register");
    revalidatePath("/vendee/home");
  }
  return result;
}

export async function getAllBuyerAction(type, lend, borrow) {
  const result = await getAllBuyer({ type, lend, borrow });
  return result;
}
