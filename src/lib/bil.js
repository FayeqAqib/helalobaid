// OrderReceipt.jsx
import React from "react";

const OrderReceipt = ({ ref, data }) => {
  return (
    <div ref={ref}>
      <h2>بل سفارش</h2>
      <p>نام خریدار: احمد</p>
      <p>مقدار: {data.totalAmount} افغانی</p>
      <p>تاریخ: {new Date().toLocaleDateString()}</p>
    </div>
  );
};

export default OrderReceipt;
