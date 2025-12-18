import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import moment from "moment-timezone";
import jalaliMoment from "moment-jalaali";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value, code = "AFN") => {
  const formatted = new Intl.NumberFormat("en-AF", {
    style: "decimal",
    minimumFractionDigits: 2,
  }).format(value);

  return `${formatted} ${code}`; // اضافه کردن نماد دلخواه
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

export function cleanSymbols(str) {
  if (str) return str.replace(/[,_\-\(\)]/g, "");
  return "";
}

export function fromatDate(date) {
  return jalaliMoment(
    moment(date).tz("Asia/Kabul").format("YYYY-MM-DD HH:mm")
  ).format("jYYYY/jMM/jDD HH:mm");
}
