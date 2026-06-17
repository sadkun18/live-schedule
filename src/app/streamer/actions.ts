"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getStreamerByPin, upsertSale } from "@/lib/db";
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
  const scheduleId = Number(formData.get("schedule_id"));
  const amount = Number(formData.get("amount"));
  const orderCount = Number(formData.get("order_count"));

  if (isNaN(amount) || amount < 0) {
    redirect(`/streamer/schedules/${scheduleId}?error=invalid`);
  }

  upsertSale({
    schedule_id: scheduleId,
    streamer_id: session.streamerId,
    amount,
    order_count: orderCount || 0,
    notes: (formData.get("notes") as string) || undefined,
  });

  revalidatePath("/streamer");
  revalidatePath("/streamer/schedules");
  revalidatePath("/streamer/sales");
  revalidatePath("/admin/sales");
  redirect("/streamer/schedules");
}
