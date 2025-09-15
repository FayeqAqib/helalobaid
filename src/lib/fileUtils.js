import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_BASE = path.join(process.cwd(), "public");

export async function uploadImage(file, sub = "uploads") {
  if (!file || !file.size) return { path: "", err: false };
  try {
    const ext = path.extname(file.name);
    const name = crypto.randomUUID() + ext;
    const dir = path.join(UPLOAD_BASE, sub);
    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    const fullPath = path.join(dir, name);
    await writeFile(fullPath, Buffer.from(bytes));
    return { path: `/${sub}/${name}`, err: false };
  } catch (e) {
    return { path: "", err: true };
  }
}

export async function deleteFile(filePath) {
  if (!filePath) return;
  try {
    const full = path.join(UPLOAD_BASE, filePath);
    await unlink(full);
  } catch {}
}
