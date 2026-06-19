import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStreamers } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PLATFORMS } from "@/lib/types";
import { deleteStreamerAction, updateStreamerAction } from "../actions";
import CreateStreamerModal from "@/components/Streamer/CreateStreamerModal";
import { Trash2 } from "lucide-react";

export default async function StreamersPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  const streamers = getStreamers();

  return (
    <AppShell role="admin">
      <PageHeader title="Streamer" subtitle="Kelola live streamer & PIN login" />

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900">Daftar Streamer</h2>
        <CreateStreamerModal />
      </div>

      <div className="space-y-3">
        {streamers.map((s) => (
          <Card key={s.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-zinc-900">{s.name}</p>
                <p className="text-sm text-zinc-500">{s.platform}</p>
                {s.phone && <p className="text-xs text-zinc-400">{s.phone}</p>}
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  s.is_active ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {s.is_active ? "Aktif" : "Nonaktif"}
              </span>
            </div>

            <details className="group">
              <summary className="cursor-pointer text-sm text-violet-600">Edit</summary>
              <form action={updateStreamerAction} className="mt-3 space-y-2 border-t border-zinc-100 pt-3">
                <input type="hidden" name="id" value={s.id} />
                <Input label="Nama" name="name" defaultValue={s.name} />
                <Input label="PIN Baru (kosongkan jika tidak diubah)" name="pin" type="password" inputMode="numeric" />
                <Input label="No. HP" name="phone" defaultValue={s.phone ?? ""} />
                <Select
                  label="Platform"
                  name="platform"
                  defaultValue={s.platform}
                  options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                />
                <Select
                  label="Status"
                  name="is_active"
                  defaultValue={String(s.is_active)}
                  options={[
                    { value: "1", label: "Aktif" },
                    { value: "0", label: "Nonaktif" },
                  ]}
                />
                <Button type="submit" variant="secondary" size="sm" className="w-full">Simpan</Button>
              </form>
            </details>

            <form action={deleteStreamerAction}>
              <input type="hidden" name="id" value={s.id} />
              <Button type="submit" variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" /> Hapus
              </Button>
            </form>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
