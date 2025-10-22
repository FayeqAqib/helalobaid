"use server";

import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getAllProductInBuy,
  updateProduct,
} from "@/services/productService";

import { revalidateTag } from "next/cache";

////////////////////////////////////////// CREATE ///////////////////////////////////////////////////////
export default async function createProductAction(data) {
  const result = await createProduct(data);

  if (!result.err) {
    revalidateTag("product");
  }
  return result;
}

/////////////////////////////////////// UPDATE /////////////////////////////////////////////
export async function updateProductAction(data) {
  const result = await updateProduct(data);

  if (!result.err) {
    revalidateTag("product");
  }
  return result;
}

////////////////////////////////////////// DELETE ////////////////////////////////////////////
export async function deleteProductAction(data) {
  const result = await deleteProduct(data);

  if (!result.err) {
    revalidateTag("product");
  }
  return result;
}

////////////////////////////////////////////////GET//////////////////////////////////
export async function getAllProductAction() {
  const result = await getAllProductInBuy();

  return result;
}
