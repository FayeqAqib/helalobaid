import { auth } from "@/lib/auth";
import { exec } from "child_process";

const baseUrl = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
const backUp = process.env.MONGODBBACKUP_URI;
const DB_NAME = process.env.DB_NAME;
const DB_BACKUP_NAME = process.env.DB_BACKUP_NAME;
export async function GET() {
  try {
    const session = await auth();
    if (!session.user._doc.role || session.user._doc.role !== "admin") {
      return new Response(
        JSON.stringify("شما اجازه دسترسی به این صفحه را ندارید"),
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": `${baseUrl}${DB_BACKUP_NAME}`,
            "Content-Type": "application/json",
          },
        }
      );
    }

    await new Promise((resolve, reject) => {
      exec(
        `mongodump --uri="${backUp}${DB_BACKUP_NAME}?directConnection=true&authSource=admin" --archive="mongodump-test-db" `,
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    await new Promise((resolve, reject) => {
      exec(
        `mongorestore --uri="${backUp}?authSource=admin" --archive="mongodump-test-db" --drop --nsFrom="${DB_BACKUP_NAME}.*" --nsTo="${DB_NAME}.*"`,
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });

    return new Response(
      JSON.stringify("بکاپ همه کالکشن‌ها با موفقیت اجرا شد"),
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
