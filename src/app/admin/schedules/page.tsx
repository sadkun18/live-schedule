import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSchedules, getStreamers } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { ScheduleCard } from "@/components/ScheduleCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PLATFORMS } from "@/lib/types";
import { createScheduleAction, deleteScheduleAction, updateScheduleAction } from "../actions";
import CreateScheduleModalToggle from "@/components/CreateScheduleModalToggle";
import { toDatetimeLocalValue } from "@/lib/format";
import { Trash2 } from "lucide-react";

export default async function SchedulesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  const streamers = getStreamers(true);
  const schedules = getSchedules();

  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setHours(now.getHours() + 1, 0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setHours(defaultStart.getHours() + 2);

  return (
    <AppShell role="admin">
      <PageHeader title="Jadwal Live" subtitle="Atur jadwal streaming semua streamer" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Jadwal Live</h2>
        <div>
          <CreateScheduleModalToggle />
        </div>
      </div>

      {/* Modal markup rendered server-side; visibility toggled by client script */}
      <div id="create-schedule-modal" className="hidden fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
        <div className="relative z-10 w-full max-w-xl rounded-xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900">Buat Jadwal Baru</h2>
            <button id="close-create-schedule" type="button" className="text-zinc-500">Tutup</button>
          </div>
          <div className="mt-4">
            <form action={createScheduleAction} className="space-y-3">
              <Input label="Judul Live" name="title" placeholder="Flash Sale, New Arrival, dll." required />
              <Select
                label="Streamer"
                name="streamer_id"
                options={streamers.map((s) => ({ value: s.id, label: s.name }))}
              />
              <Select
                label="Platform"
                name="platform"
                options={PLATFORMS.map((p) => ({ value: p, label: p }))}
              />
              <Input
                label="Mulai"
                name="start_at"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(defaultStart.toISOString())}
                required
              />
              <Input
                label="Selesai"
                name="end_at"
                type="datetime-local"
                defaultValue={toDatetimeLocalValue(defaultEnd.toISOString())}
                required
              />
              <Input label="Catatan (opsional)" name="notes" placeholder="Produk fokus, promo, dll." />
              <Button type="submit" className="w-full">Buat Jadwal</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {schedules.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Belum ada jadwal</p>
        ) : (
          schedules.map((s) => (
            <Card key={s.id} className="space-y-3">
              <ScheduleCard schedule={s} showStreamer />

              <details className="group">
                <summary className="cursor-pointer text-sm text-violet-600">Edit / Ubah Status</summary>
                <form action={updateScheduleAction} className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
                  <input type="hidden" name="id" value={s.id} />
                  <Input label="Judul" name="title" defaultValue={s.title} />
                  <Select
                    label="Streamer"
                    name="streamer_id"
                    defaultValue={s.streamer_id}
                    options={streamers.map((st) => ({ value: st.id, label: st.name }))}
                  />
                  <Select
                    label="Platform"
                    name="platform"
                    defaultValue={s.platform}
                    options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                  />
                  <Input
                    label="Mulai"
                    name="start_at"
                    type="datetime-local"
                    defaultValue={toDatetimeLocalValue(s.start_at)}
                  />
                  <Input
                    label="Selesai"
                    name="end_at"
                    type="datetime-local"
                    defaultValue={toDatetimeLocalValue(s.end_at)}
                  />
                  <Select
                    label="Status"
                    name="status"
                    defaultValue={s.status}
                    options={[
                      { value: "scheduled", label: "Terjadwal" },
                      { value: "live", label: "Sedang Live" },
                      { value: "completed", label: "Selesai" },
                      { value: "cancelled", label: "Batal" },
                    ]}
                  />
                  <Input label="Catatan" name="notes" defaultValue={s.notes ?? ""} />
                  <Button type="submit" variant="secondary" size="sm" className="w-full">Simpan</Button>
                </form>
              </details>

              <form action={deleteScheduleAction}>
                <input type="hidden" name="id" value={s.id} />
                <Button type="submit" variant="ghost" size="sm" className="text-red-500">
                  <Trash2 className="h-4 w-4" /> Hapus
                </Button>
              </form>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
