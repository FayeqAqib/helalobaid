"use server";

import { signOut } from "@/lib/auth";

import { createUser } from "@/services/userServer";

export default async function createUserAction(data) {
  const result = await createUser(data);
  return result;
}

export async function signOutAction() {
  const result = await signOut();
  return result;
}
