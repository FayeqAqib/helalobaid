import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value) => {
  const formatted = new Intl.NumberFormat("pr-IR", {
    style: "currency",
    currency: "AFG",
  }).format(value);

  return formatted;
};
export const formatNumber = (value) => {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
  }).format(value);

  return formatted;
};
