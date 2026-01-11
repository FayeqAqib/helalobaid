import { Bill } from "@/models/billHeaderAndFooter";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { rimraf } from "rimraf";

async function recreateLogoFolder(folderName, file, fixedName = "logo.png") {
  const folderPath = path.join(process.cwd(), "upload/buy", folderName);
  const filePath = path.join(folderPath, fixedName);

  try {
    // پاک کردن پوشه و محتوایش
    await rimraf(folderPath);

    // ساخت دوباره پوشه
    await fs.mkdir(folderPath, { recursive: true });

    // خواندن محتوای فایل آپلود شده
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ذخیره عکس جدید داخل پوشه
    await fs.writeFile(filePath, buffer);

    return `/public/${folderName}/${fixedName}`;
  } catch (err) {
    console.error("خطا:", err);
    throw err;
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const header = formData.get("header");
    const footer = formData.get("footer");
    const logo = formData.get("logo");
    const isNewHeader = formData.get("isNewHeader");
    const isNewFooter = formData.get("isNewFooter");
    const isNewLogo = formData.get("isNewLogo");

    if (isNewHeader !== "false" && header) {
      const fileName = await recreateLogoFolder("header", header, "header.png");
      await Bill.findOneAndUpdate({}, { $set: { header: fileName } });
    }
    if (isNewFooter !== "false" && footer) {
      const fileName = await recreateLogoFolder("footer", footer, "footer.png");
      await Bill.findOneAndUpdate({}, { $set: { footer: fileName } });
    }
    if (isNewLogo !== "false" && logo) {
      const fileName = await recreateLogoFolder("logo", logo, "logo.png");
      await Bill.findOneAndUpdate({}, { $set: { logo: fileName } });
    }

    return NextResponse.json({ message: "✅ آپلود موفق بود" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "❌ خطا در آپلود" }, { status: 500 });
  }
}
