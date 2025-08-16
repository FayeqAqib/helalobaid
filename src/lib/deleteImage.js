import fs from "fs/promises";

import path from "path";

export const deleteFile = async (filePath) => {
  try {
    // مسیر مطلق فایل

    const uploadDir = path.join(process.cwd(), "public", filePath);
    const absolutePath = path.resolve(uploadDir);

    await fs.unlink(absolutePath);

    return { success: true, err: false };
  } catch (err) {
    return { success: false, err: true };
  }
};
