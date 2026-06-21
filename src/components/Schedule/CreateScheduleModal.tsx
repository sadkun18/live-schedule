"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, User, Globe, FileText, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PLATFORMS, Streamer } from "@/lib/types";
import { createScheduleAction } from "@/app/admin/actions";
import { toDatetimeLocalValue } from "@/lib/format";

interface CreateScheduleModalProps {
  streamers: Streamer[];
  defaultStart: string;
  defaultEnd: string;
}

export default function CreateScheduleModal({ streamers, defaultStart, defaultEnd }: CreateScheduleModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-2xl bg-violet-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-200 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          Tambah Jadwal
        </span>
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-violet-600 to-fuchsia-500 opacity-0 transition-opacity group-hover:opacity-100" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Buat Jadwal Live"
        description="Siapkan sesi live streaming berikutnya"
      >
        <form
          action={async (formData) => {
            await createScheduleAction(formData);
            setIsOpen(false);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <Input
                label="Judul Sesi"
                name="title"
                placeholder="Contoh: Flash Sale Ramadan"
                className="pl-12"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                  <User className="h-5 w-5" />
                </div>
                <Select
                  label="Streamer"
                  name="streamer_id"
                  className="pl-12"
                  options={streamers.map((s) => ({ value: s.id, label: s.name }))}
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                  <Globe className="h-5 w-5" />
                </div>
                <Select
                  label="Platform"
                  name="platform"
                  className="pl-12"
                  options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 p-4 space-y-4 border border-zinc-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <Clock className="h-4 w-4 text-violet-600" />
                Waktu Pelaksanaan
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Waktu Mulai"
                  name="start_at"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(defaultStart)}
                  required
                />
                <Input
                  label="Waktu Selesai"
                  name="end_at"
                  type="datetime-local"
                  defaultValue={toDatetimeLocalValue(defaultEnd)}
                  required
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                <FileText className="h-5 w-5" />
              </div>
              <Input
                label="Catatan (Opsional)"
                name="notes"
                placeholder="Detail promo atau daftar produk"
                className="pl-12"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 rounded-xl"
              onClick={() => setIsOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-[2] rounded-xl bg-zinc-900 text-white hover:bg-zinc-800"
            >
              Konfirmasi Jadwal
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
