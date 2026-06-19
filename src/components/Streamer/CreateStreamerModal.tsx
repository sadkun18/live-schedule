"use client";

import { useState } from "react";
import { Plus, User, Key, Phone, Globe, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PLATFORMS } from "@/lib/types";
import { createStreamerAction } from "@/app/admin/actions";

export default function CreateStreamerModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="group relative overflow-hidden rounded-2xl bg-pink-600 px-6 py-2.5 font-semibold text-white transition-all hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-200 active:scale-95"
      >
        <span className="relative z-10 flex items-center gap-2">
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          Tambah Streamer
        </span>
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-pink-600 to-rose-500 opacity-0 transition-opacity group-hover:opacity-100" />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Tambah Streamer Baru"
        description="Daftarkan streamer untuk mengelola sesi live"
      >
        <form
          action={async (formData) => {
            await createStreamerAction(formData);
            setIsOpen(false);
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                <User className="h-5 w-5" />
              </div>
              <Input
                label="Nama Lengkap"
                name="name"
                placeholder="Contoh: Siti Aminah"
                className="pl-12"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                  <Key className="h-5 w-5" />
                </div>
                <Input
                  label="PIN Login"
                  name="pin"
                  type="password"
                  inputMode="numeric"
                  placeholder="4 digit angka"
                  maxLength={4}
                  className="pl-12"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                  <Globe className="h-5 w-5" />
                </div>
                <Select
                  label="Platform Utama"
                  name="platform"
                  className="pl-12"
                  options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-4 top-[2.4rem] text-zinc-400">
                <Phone className="h-5 w-5" />
              </div>
              <Input
                label="Nomor WhatsApp"
                name="phone"
                type="tel"
                placeholder="08xxxxxxxxxx"
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
              Simpan Data Streamer
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
