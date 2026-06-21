import Link from "next/link";
import { Radio, Shield, Smartphone } from "lucide-react";

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-12">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200">
          <Radio className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Live Schedule</h1>
        <p className="mt-2 text-zinc-500">
          Kelola jadwal live streaming &amp; sales streamer online shop Anda
        </p>
      </div>

      <div className="space-y-3">
        <Link href="/admin/login" className="block">
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Shield className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-zinc-900">Admin / Manager</p>
              <p className="text-sm text-zinc-500">Atur jadwal, streamer, &amp; lihat laporan sales</p>
            </div>
          </div>
        </Link>

        <Link href="/streamer/login" className="block">
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50 text-pink-600">
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-zinc-900">Streamer</p>
              <p className="text-sm text-zinc-500">Lihat jadwal live &amp; input sales</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-auto pt-10 text-center">
        <p className="text-xs text-zinc-400">
          Install di HP: buka di browser → Add to Home Screen
        </p>
      </div>
    </div>
  );
}
