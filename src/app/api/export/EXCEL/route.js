import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import ExcelJS from "exceljs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    // ایجاد workbook جدید
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "سیستم مدیریت محتوا";
    workbook.created = new Date();

    // پردازش هر کلکشن
    for (const col of collections) {
      const worksheet = workbook.addWorksheet(sanitizeSheetName(col.name));
      const collection = db.collection(col.name);

      // دریافت داده‌ها با استفاده از صفحه‌بندی
      const batchSize = 1000;
      let skip = 0;
      let hasMore = true;
      let headersSet = false;
      let headers = [];
      let rowCount = 0;

      while (hasMore) {
        const documents = await collection
          .find({})
          .skip(skip)
          .limit(batchSize)
          .toArray();
        if (documents.length === 0) {
          hasMore = false;
          continue;
        }

        // تعیین هدرها در اولین دسته داده
        if (!headersSet) {
          headers = Object.keys(documents[0]);
          const headerRow = worksheet.addRow(headers);

          // استایل دهی به هدرها
          headerRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FF2E86AB" },
            };
            cell.font = {
              bold: true,
              color: { argb: "FFFFFFFF" },
            };
            cell.border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          });
          headersSet = true;
        }

        // افزودن داده‌ها به شیت
        documents.forEach((doc) => {
          const rowData = headers.map((header) => {
            const value = doc[header];
            return formatExcelValue(value);
          });
          worksheet.addRow(rowData);
          rowCount++;
        });

        skip += batchSize;
      }

      // تنظیم خودکار عرض ستون‌ها
      if (headersSet) {
        headers.forEach((header, index) => {
          let maxLength = header.length;
          worksheet
            .getColumn(index + 1)
            .eachCell({ includeEmpty: true }, (cell) => {
              const length = cell.value ? cell.value.toString().length : 0;
              if (length > maxLength) maxLength = length;
            });
          worksheet.getColumn(index + 1).width = Math.min(maxLength + 2, 50);
        });
      } else {
        // اگر کلکشن خالی بود
        const row = worksheet.addRow(["هیچ داده‌ای در این کلکشن وجود ندارد"]);
        worksheet.mergeCells(`A${row.number}:D${row.number}`);
        const messageCell = worksheet.getCell(`A${row.number}`);
        messageCell.font = { bold: true, color: { argb: "FFFF0000" } };
        messageCell.alignment = { horizontal: "center" };
      }
    }

    // تولید بافر فایل اکسل
    const buffer = await workbook.xlsx.writeBuffer();

    return new Response(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=database_export.xlsx",
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

// تابع برای فرمت‌دهی مقادیر اکسل
function formatExcelValue(value) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value;
  if (typeof value === "object") return JSON.stringify(value);
  return value;
}

// تابع برای اصلاح نام شیت‌ها
function sanitizeSheetName(name) {
  return name.replace(/[\\/*\[\]:?]/g, "").substring(0, 30);
}
