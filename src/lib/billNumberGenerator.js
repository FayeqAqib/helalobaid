// utils/billNumberGenerator.js
export const generateBillNumber = async (BuyModel, prefix = "BL") => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(-2);
  const month = (today.getMonth() + 1).toString().padStart(2, "0");

  // الگوی: BL2412-001 (پیشوند + سال دو رقمی + ماه دو رقمی + شماره سریال)
  const pattern = new RegExp(`^${prefix}${year}${month}-(\\d+)$`);

  // پیدا کردن آخرین شماره بل برای این ماه
  const lastBill = await BuyModel.findOne(
    { billNumber: pattern },
    { billNumber: 1 },
    { sort: { billNumber: -1 } }
  );

  let serialNumber = 1;
  if (lastBill && lastBill.billNumber) {
    const matches = lastBill.billNumber.match(pattern);
    if (matches && matches[1]) {
      serialNumber = parseInt(matches[1]) + 1;
    }
  }

  return `${prefix}${year}${month}-${serialNumber.toString().padStart(3, "0")}`;
};
