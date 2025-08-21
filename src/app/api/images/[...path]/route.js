import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request, { params }) {
  try {
    const myparams = await params;
    const paths = myparams.path;
    console.log(paths);
    const filePath = path.join(process.cwd(), ...paths);
    console.log(filePath);
    // بررسی وجود فایل
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "فایل یافت نشد" }, { status: 404 });
    }

    // خواندن فایل
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();

    // تعیین نوع محتوا بر اساس پسوند فایل
    const contentType = getContentType(fileExtension);
    console.log(fileBuffer, "hhhhhhhhhhhhh");
    // بازگرداندن فایل به عنوان پاسخ
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // کش برای یک سال
      },
    });
  } catch (error) {
    console.error("خطا در خواندن فایل:", error);
    return NextResponse.json({ error: "خطا در خواندن فایل" }, { status: 500 });
  }
}

// تابع کمکی برای تعیین نوع محتوا
function getContentType(extension) {
  const contentTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };

  return contentTypes[extension] || "application/octet-stream";
}
