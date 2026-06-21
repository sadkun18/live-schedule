"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStreamerByPin, upsertSale, createSchedule } from "@/lib/db";
import fs from "fs";
import path from "path";
import { clearSession, createSession, requireStreamer } from "@/lib/auth";

export async function streamerLogin(formData: FormData) {
  const pin = formData.get("pin") as string;
  const streamer = getStreamerByPin(pin);
  if (!streamer) {
    return { error: "PIN tidak valid atau akun nonaktif" };
  }
  await createSession({
    role: "streamer",
    streamerId: streamer.id,
    streamerName: streamer.name,
  });
  redirect("/streamer");
}

export async function streamerLogout() {
  await clearSession();
  redirect("/streamer/login");
}

export async function submitSalesAction(formData: FormData) {
  const session = await requireStreamer();
  const scheduleIdRaw = formData.get("schedule_id");
  const scheduleId = scheduleIdRaw ? Number(scheduleIdRaw) : NaN;
  const amount = Number(formData.get("amount"));
  const orderCount = Number(formData.get("order_count"));

  if (isNaN(amount) || amount < 0) {
    const redirectTarget = !isNaN(scheduleId) ? `/streamer/schedules/${scheduleId}?error=invalid` : "/streamer/sales/input?error=invalid";
    redirect(redirectTarget);
  }

  let targetScheduleId = scheduleId;

  // If no schedule_id provided, create a schedule from provided fields
  if (isNaN(targetScheduleId)) {
    const platform = (formData.get("platform") as string) || "Shopee Live";
    const date = (formData.get("date") as string) || "";
    const startTime = (formData.get("start_time") as string) || "00:00";
    const endTime = (formData.get("end_time") as string) || "23:59";
    const title = (formData.get("title") as string) || `Manual Sales ${date}`;

    // Build ISO strings (assume input is local date and time)
    let startAt = new Date(`${date}T${startTime}`);
    let endAt = new Date(`${date}T${endTime}`);
    if (isNaN(startAt.getTime())) startAt = new Date();
    if (isNaN(endAt.getTime())) endAt = new Date(startAt.getTime() + 60 * 60 * 1000);

    const schedule = createSchedule({
      streamer_id: session.streamerId,
      title,
      platform,
      start_at: startAt.toISOString(),
      end_at: endAt.toISOString(),
    });

    targetScheduleId = schedule.id;
  }

  // handle screenshot file upload (optional)
  let screenshotPath: string | null = null;
  const file = formData.get("screenshot") as File | null;
  if (file && (file as any).size && (file as any).size > 0) {
    try {
      const uploadsDir = path.join(process.cwd(), "data", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname((file as any).name || "") || ".jpg";
      const filename = `${Date.now()}-${Math.floor(Math.random() * 10000)}${ext}`;
      const filePath = path.join(uploadsDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(filePath, buffer);
      screenshotPath = `uploads/${filename}`;
    } catch (err) {
      screenshotPath = null;
    }
  }

  upsertSale({
    schedule_id: targetScheduleId,
    streamer_id: session.streamerId,
    amount,
    order_count: orderCount || 0,
    notes: (formData.get("notes") as string) || undefined,
    screenshot: screenshotPath,
  });

  revalidatePath("/streamer");
  revalidatePath("/streamer/schedules");
  revalidatePath("/streamer/sales");
  revalidatePath("/admin/sales");
  redirect("/streamer/schedules");
}
