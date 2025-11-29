"use server";

import {
  createCurrency,
  deleteCurrency,
  findCurrency,
  updateCurrency,
} from "@/services/currencyServices";

export const createCurrencyAction = async (data) => {
  const result = await createCurrency(data);
  return result;
};

export const updateCurrencyAction = async (data) => {
  const result = await updateCurrency(data);
  return result;
};

export const deleteCurrencyAction = async (id) => {
  const result = await deleteCurrency(id);
  return result;
};

export const findAllCurrencyAction = async () => {
  return await findCurrency();
};
