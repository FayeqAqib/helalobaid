import { exec } from "child_process";

const baseUrl = process.env.NEXTAUTH_URL;

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
        `mongorestore --archive="mongodump-test-db" --nsFrom="backUp.*" --nsTo="test.*"`,
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
