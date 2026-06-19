"use client";

import { useActionState } from "react";
import Link from "next/link";
import { streamerLogin } from "../actions";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Smartphone } from "lucide-react";

export default function StreamerLoginPage() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      return (await streamerLogin(formData)) ?? null;
    },
    null
  );

  return (
    <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-600 text-white">
          <Smartphone className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Login Streamer</h1>
        <p className="mt-1 text-sm text-zinc-500">Masukkan PIN yang diberikan admin</p>
      </div>

      <form action={action} className="space-y-4">
        <Input
          label="PIN Streamer"
          name="pin"
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="••••"
          required
          autoFocus
        />
        {state?.error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{state.error}</p>
        )}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Memproses..." : "Masuk"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-zinc-400">
        Demo PIN: 1111 (Sari), 2222 (Budi), 3333 (Dewi)
      </p>
    </div>
  );
}
