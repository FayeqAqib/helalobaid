import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    // ایجاد یک استریم قابل خواندن برای ترکیب چندین فایل CSV
    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const batchSize = 1000; // اندازه دسته برای پردازش گروهی

        // تابع کمکی برای نوشتن داده در استریم با مدیریت بک‌پرشر
        const writeToStream = (data) => {
          controller.enqueue(encoder.encode(data));
        };

        // پردازش هر کلکشن
        for (const col of collections) {
          writeToStream(`\n\n--- Collection: ${col.name} ---\n`);

          const collection = db.collection(col.name);
          const count = await collection.estimatedDocumentCount();

          // اگر کلکشن خالی باشد
          if (count === 0) {
            writeToStream('"No data available in this collection"\n');
            continue;
          }

          // ایجاد هدرها بر اساس یک نمونه سند
          const sampleDoc = await collection.findOne({});
          const headers = Object.keys(sampleDoc);
          writeToStream(
            headers.map((h) => `"${escapeCSV(h)}"`).join(",") + "\n"
          );

          // پردازش داده‌ها به صورت دسته‌ای
          let skip = 0;
          let processed = 0;

          while (processed < count) {
            const documents = await collection
              .find({})
              .skip(skip)
              .limit(batchSize)
              .toArray();

            // ایجاد خطوط CSV برای دسته جاری
            const batchData =
              documents
                .map((doc) => {
                  return headers
                    .map((header) => {
                      let value = doc[header];
                      return formatCSVValue(value);
                    })
                    .join(",");
                })
                .join("\n") + "\n";

            writeToStream(batchData);

            skip += batchSize;
            processed += documents.length;
          }
        }

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=database_export.csv",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "خطا در تولید فایل",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// تابع برای فرمت‌دهی مقادیر CSV
function formatCSVValue(value) {
  if (value === null || value === undefined) return '""';
  if (value instanceof Date) return `"${value.toISOString()}"`;
  if (typeof value === "object") return `"${escapeCSV(JSON.stringify(value))}"`;

  // مدیریت مقادیر عددی بدون کوتیشن
  if (typeof value === "number" || typeof value === "boolean") {
    return value.toString();
  }

  return `"${escapeCSV(value.toString())}"`;
}

// تابع برای فرار دادن کاراکترهای خاص در CSV
function escapeCSV(str) {
  return String(str)
    .replace(/"/g, '""')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");
}
