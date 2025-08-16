"use server";
import {
  createAccount,
  deleteAccount,
  getAllAccount,
  getAllSallerAndBuyer,
  updateAccount,
} from "@/services/accountService";

import { revalidatePath } from "next/cache";

export default async function createAccountAction(data) {
  const result = await createAccount(data);

  if (!result.err) {
    revalidatePath("/register");
    revalidatePath("/home");
  }
  return result;
}

export async function getAllAccountAction(filter) {
  const result = await getAllAccount(filter);
  return result;
}

export async function getAllSallerAndBuyerAction(type, lend, borrow) {
  const result = await getAllSallerAndBuyer({ type, lend, borrow });
  return result;
}

export async function updateAccountAction(data) {
  const result = await updateAccount(data);
  if (!result.err) {
    revalidatePath("/register");
    revalidatePath("/home");
  }
  return result;
}

export async function deleteAccountAction(data) {
  const result = await deleteAccount(data);
  if (!result.err) {
    revalidatePath("/register");
    revalidatePath("/home");
  }
  return result;
}
