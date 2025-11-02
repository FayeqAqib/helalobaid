import { deleteFile } from "@/lib/deleteImage";
import { uploadImage } from "@/lib/uploadImage";
import { Bill } from "@/models/billHeaderAndFooter";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const header = formData.get("header");
    const footer = formData.get("footer");
    const isNewHeader = formData.get("isNewHeader");
    const isNewFooter = formData.get("isNewFooter");
    const oldHeader = formData.get("oldHeader");
    const oldFooter = formData.get("oldFooter");
    const _id = formData.get("_id");

    if (isNewHeader !== "false") {
      await deleteFile(oldHeader);
      const { path, err } = await uploadImage(header);

      if (err) {
        return {
          message:
            "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
        };
      }
      if (_id !== "undefined") {
        await Bill.findByIdAndUpdate(_id, { header: path });
      } else {
        await Bill.create({ header: path });
      }
    }
    if (isNewFooter !== "false") {
      await deleteFile(oldFooter);
      const { path, err } = await uploadImage(footer);

      if (err) {
        return {
          message:
            "در بارگذاری فایل مشکلی به وجود آمده لطفا بعدا دوباره تلاش کننین",
        };
      }
      if (_id !== "undefined") {
        await Bill.findByIdAndUpdate(_id, { footer: path });
      } else {
        await Bill.create({ footer: path });
      }
    }

    return NextResponse.json(
      {
        message: "✅ آپلود موفق بود",
      },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "",
      },
      { status: 500 }
    );
  }
}
