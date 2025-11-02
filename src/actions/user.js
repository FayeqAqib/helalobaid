"use server";

import { signOut } from "@/lib/auth";

import { createUser, deleteUser, updateUser } from "@/services/userServer";
import { revalidatePath } from "next/cache";

export async function createUserAction(data) {
  const result = await createUser(data);
  revalidatePath("/customer/setting");
  return result;
}

export async function signOutAction() {
  const result = await signOut();
  return result;
}

export async function deleteUserAction(_id, owner) {
  const result = await deleteUser(_id, owner);
  revalidatePath("/customer/setting");
  return result;
}

export async function updateUserAction(data) {
  const result = await updateUser(data);
  revalidatePath("/customer/setting");
  return result;
}
