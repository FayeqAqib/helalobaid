import { exec } from "child_process";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    await new Promise((resolve, reject) => {
      exec(`mongodump --archive="mongodump-test-db" --db=backUp`, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      exec(
        `mongorestore --archive="mongodump-test-db" --nsFrom="backUp.*" --nsTo="plaza.*"`,
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    return Response.json({ message: "بکاپ همه کالکشن‌ها با موفقیت انجام شد" });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
