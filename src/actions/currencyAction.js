"use server";

import {
  createCurrency,
  deleteCurrency,
  findCurrency,
  updateCurrency,
} from "@/services/currencyServices";
import { revalidateTag } from "next/cache";

export const createCurrencyAction = async (data) => {
  const result = await createCurrency(data);
  if (!result.err) {
    revalidateTag("currency");
  }
  return result;
};

export const updateCurrencyAction = async (data) => {
  const result = await updateCurrency(data);
  if (!result.err) {
    revalidateTag("currency");
  }
  return result;
};

export const deleteCurrencyAction = async (id) => {
  const result = await deleteCurrency(id);
  if (!result.err) {
    revalidateTag("currency");
  }
  return result;
};

export const findAllCurrencyAction = async () => {
  return await findCurrency();
};
