import { NextResponse } from "next/server";
import { getSales } from "@/lib/db";

function escapeCsv(value: any) {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  let from: string | undefined;
  let to: string | undefined;
  if (date) {
    from = new Date(`${date}T00:00:00`).toISOString();
    to = new Date(`${date}T23:59:59`).toISOString();
  }

  const sales = getSales({ from, to });

  const rows = [];
  const header = ["id", "streamer_name", "schedule_title", "start_at", "amount", "order_count", "notes", "screenshot"];
  rows.push(header.join(","));

  for (const s of sales) {
    const row = [
      s.id,
      escapeCsv(s.streamer_name),
      escapeCsv(s.schedule_title),
      escapeCsv(s.start_at),
      s.amount,
      s.order_count,
      escapeCsv(s.notes),
      escapeCsv(s.screenshot),
    ];
    rows.push(row.join(","));
  }

  const csv = rows.join("\n");

  const filename = date ? `sales-${date}.csv` : `sales-${new Date().toISOString().slice(0,10)}.csv`;
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
