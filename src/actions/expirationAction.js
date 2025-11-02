"use server";

import { createExpiration } from "@/services/expirationService";

export async function createExpirationAction(data) {
  const result = await createExpiration(data);

  return result;
}
