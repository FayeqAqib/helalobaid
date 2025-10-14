import { exec } from "child_process";

import fs from "fs";
import { BackUp } from "@/models/backUp";

import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";

const baseUrl = process.env.NEXTAUTH_URL;
const backUp = process.env.MONGODBBACKUP_URI;
export async function GET() {
  try {
    const session = await auth();
    if (!session.user._doc.role || session.user._doc.role !== "admin") {
      return new Response(
        JSON.stringify("شما اجازه دسترسی به این صفحه را ندارید"),
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": `${baseUrl}`,
            "Content-Type": "application/json",
          },
        }
      );
    }
    // مسیر دقیق فایل‌های bson
    // if (fs.existsSync(dumpPath)) {
    //   fs.rmSync(dumpPath, { recursive: true, force: true });
    // }
    // const db = await mongoose.connect(`${MONGODB_URI}/backUp`, {
    //   directConnection: true,
    // });
    // await db.connection.dropDatabase();
    // 1. گرفتن بکاپ
    await new Promise((resolve, reject) => {
      exec(
        `mongodump --uri="${backUp}/nabchoob?authSource=admin" --archive="mongodump-test-db"`,
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    // چک کردن وجود پوشه test
    // if (!fs.existsSync(dbFolder)) {
    //   throw new Error("پوشه بکاپ ساخته نشده یا فایل bson وجود ندارد!");
    // }

    // 2. بازگردانی دیتابیس به نام backup
    await new Promise((resolve, reject) => {
      exec(
        ` mongorestore --uri="${backUp}?authSource=admin" --archive="mongodump-test-db" --nsFrom="nabchoob.*" --nsTo="nabchoobBackUp.*"`,
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

    return new Response(
      JSON.stringify("بکاپ همه کالکشن‌ها با موفقیت انجام شد"),
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": `${baseUrl}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
