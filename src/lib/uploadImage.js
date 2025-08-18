import { writeFile, mkdir } from "fs/promises";
import fs from "fs";
import path from "path";

export async function uploadImage(image, myPath = "upload/buy") {
  if (image?.size > 0) {
    try {
      console.log(image);
      const filename = `${Date.now()}-${image.name}`;
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // مسیر ذخیره‌سازی در پوشه public
      const uploadDir = path.join(process.cwd(), "public", myPath);

      // اگر پوشه وجود ندارد، بساز
      if (!fs.existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, filename);

      // ذخیره فایل
      await writeFile(filePath, buffer);

      // مسیر برای دسترسی از سمت کلاینت
      return { path: `/${myPath}/${filename}`, err: false };
    } catch (err) {
      return { err: true, data: {} };
    }
  } else {
    return { path: "", err: false };
  }
}
