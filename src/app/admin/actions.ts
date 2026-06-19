"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createSchedule,
  createStreamer,
  deleteSchedule,
  deleteStreamer,
  updateSchedule,
  updateStreamer,
} from "@/lib/db";
import { clearSession, createSession, requireAdmin, verifyAdminPin } from "@/lib/auth";
import type { ScheduleStatus } from "@/lib/types";

export async function adminLogin(formData: FormData) {
  const pin = formData.get("pin") as string;
  if (!verifyAdminPin(pin)) {
    return { error: "PIN admin salah" };
  }
  await createSession({ role: "admin" });
  redirect("/admin");
}

export async function adminLogout() {
  await clearSession();
  redirect("/admin/login");
}

export async function createStreamerAction(formData: FormData) {
  await requireAdmin();
  createStreamer({
    name: formData.get("name") as string,
    pin: formData.get("pin") as string,
    phone: (formData.get("phone") as string) || undefined,
    platform: formData.get("platform") as string,
  });
  revalidatePath("/admin/streamers");
  revalidatePath("/admin");
}

export async function updateStreamerAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  updateStreamer(id, {
    name: (formData.get("name") as string) || undefined,
    pin: (formData.get("pin") as string) || undefined,
    phone: (formData.get("phone") as string) || undefined,
    platform: (formData.get("platform") as string) || undefined,
    is_active: formData.get("is_active") === "1",
  });
  revalidatePath("/admin/streamers");
}

export async function deleteStreamerAction(formData: FormData) {
  await requireAdmin();
  deleteStreamer(Number(formData.get("id")));
  revalidatePath("/admin/streamers");
  revalidatePath("/admin");
}

export async function createScheduleAction(formData: FormData) {
  await requireAdmin();
  createSchedule({
    streamer_id: Number(formData.get("streamer_id")),
    title: formData.get("title") as string,
    platform: formData.get("platform") as string,
    start_at: new Date(formData.get("start_at") as string).toISOString(),
    end_at: new Date(formData.get("end_at") as string).toISOString(),
    notes: (formData.get("notes") as string) || undefined,
  });
  revalidatePath("/admin/schedules");
  revalidatePath("/admin");
}

export async function updateScheduleAction(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  updateSchedule(id, {
    streamer_id: formData.get("streamer_id") ? Number(formData.get("streamer_id")) : undefined,
    title: (formData.get("title") as string) || undefined,
    platform: (formData.get("platform") as string) || undefined,
    start_at: formData.get("start_at")
      ? new Date(formData.get("start_at") as string).toISOString()
      : undefined,
    end_at: formData.get("end_at")
      ? new Date(formData.get("end_at") as string).toISOString()
      : undefined,
    status: (formData.get("status") as ScheduleStatus) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });
  revalidatePath("/admin/schedules");
  revalidatePath("/admin");
}

export async function deleteScheduleAction(formData: FormData) {
  await requireAdmin();
  deleteSchedule(Number(formData.get("id")));
  revalidatePath("/admin/schedules");
  revalidatePath("/admin");
}
