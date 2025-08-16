import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { BackUp } from "@/models/backUp";
import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_URI = "mongodb://localhost:27017";
export async function GET() {
  try {
    // مسیر دقیق فایل‌های bson

    // if (fs.existsSync(dumpPath)) {
    //   fs.rmSync(dumpPath, { recursive: true, force: true });
    // }
    const db = await mongoose.connect(`${MONGODB_URI}/backUp`);
    await db.connection.dropDatabase();
    // 1. گرفتن بکاپ
    await new Promise((resolve, reject) => {
      exec(`mongodump --archive="mongodump-test-db" --db=plaza`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // چک کردن وجود پوشه test
    // if (!fs.existsSync(dbFolder)) {
    //   throw new Error("پوشه بکاپ ساخته نشده یا فایل bson وجود ندارد!");
    // }

    // 2. بازگردانی دیتابیس به نام backup
    await new Promise((resolve, reject) => {
      exec(
        `mongorestore --archive="mongodump-test-db" --nsFrom="plaza.*" --nsTo="backUp.*"`,
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    fs.rmSync(`${__dirname}/mongodump-test-db`, {
      recursive: true,
      force: true,
    });
    const find = await BackUp.find({});
    if (find.lenght > 0) {
      await BackUp.updateOne({ date: new Date() });
    } else {
      await BackUp.create({ date: new Date() });
    }

    return Response.json({ message: "بکاپ همه کالکشن‌ها با موفقیت انجام شد" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
