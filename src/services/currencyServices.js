import { catchAsync } from "@/lib/catchAsync";
import { Buy } from "@/models/Buy";
import { Cost } from "@/models/cost";
import { Currency } from "@/models/Currency";
import { DepotItems } from "@/models/depotItems";
import { ExternalProceed } from "@/models/externalProceed";
import { Items } from "@/models/items";
import { Pay } from "@/models/pay";
import { Receive } from "@/models/receive";
import { Sale } from "@/models/Sale";
import { Transfer } from "@/models/transfer";

export const createCurrency = catchAsync(
  async (data) => await Currency.create(data)
);

export const deleteCurrency = catchAsync(async (id) => {
  const sale = await Sale.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );

  const buy = await Buy.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );
  const pay = await Pay.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );
  const receive = await Receive.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );
  const transfer = await Transfer.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );
  const depotItems = await DepotItems.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );
  const cost = await Cost.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );
  const externalProceed = await ExternalProceed.findOne(
    {
      "currency._id": id,
    },
    { _id: 1 }
  );

  if (
    sale ||
    buy ||
    pay ||
    receive ||
    transfer ||
    depotItems ||
    cost ||
    externalProceed
  ) {
    return {
      message:
        "با کرنسی ذیل با شرکت معاملاتی انجام داده لذا حذف این حساب ممکن نیست",
    };
  }

  const result = await Currency.findByIdAndDelete(id);
  return result;
});

export const updateCurrency = catchAsync(
  async (data) => await Currency.findByIdAndUpdate(data._id, data)
);

export const findCurrency = catchAsync(
  async (filter = {}) => await Currency.find(filter)
);

export const findOneCurrency = catchAsync(async (filter) => {
  const id = filter?.split("_")[1];
  const result = await Currency.findOne(id ? { _id: id } : {});
  return result;
});
