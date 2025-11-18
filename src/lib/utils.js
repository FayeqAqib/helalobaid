import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value) => {
  const formatted = new Intl.NumberFormat("en-AF", {
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

export const handlePrintReceipt = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/bill?_id=${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const html = await res.text();

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
};

export const handlePrintPOS = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/POSBill?_id=${id}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  const html = await res.text();

  const printWindow = window.open("", "_blank");
  printWindow.document.write(html);
  printWindow.document.close();
};
