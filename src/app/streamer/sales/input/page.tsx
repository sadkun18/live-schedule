import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import NumberInput from "@/components/ui/NumberInput";
import { Button } from "@/components/ui/Button";
import { submitSalesAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StreamerManualSalesPage({ searchParams }: { searchParams: { error?: string } }) {
  const session = await getSession();
  if (!session || session.role !== "streamer") redirect("/streamer/login");

  const { error } = searchParams || {};

  return (
    <AppShell role="streamer" showNav={false}>
      <Link
        href="/streamer/sales"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <PageHeader title="Input Sales Manual" subtitle="Masukkan data sales tanpa jadwal" />

      <Card className="mb-6">
        <form action={submitSalesAction} className="space-y-4" encType="multipart/form-data">
          <Input label="Platform" name="platform" placeholder="Shopee Live / TikTok Live" required />
          <Input label="Tanggal" name="date" type="date" required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Jam Mulai" name="start_time" type="time" />
            <Input label="Jam Selesai" name="end_time" type="time" />
          </div>
          <Input label="Judul (opsional)" name="title" placeholder="Contoh: Flash Sale" />
          <NumberInput label="Total Sales (Rp)" name="amount" placeholder="500000" required />
          <Input label="Jumlah Pesanan" name="order_count" type="number" inputMode="numeric" min="0" placeholder="25" />
          <Input label="Deskripsi (opsional)" name="notes" placeholder="Produk terlaris, kendala, dll." />
          <div>
            <label className="block text-sm font-medium text-zinc-700">Screenshot Bukti (opsional)</label>
            <input type="file" name="screenshot" accept="image/*" className="mt-2" />
          </div>
          {error === "invalid" && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">Jumlah sales tidak valid</p>
          )}
          <Button type="submit" className="w-full">Kirim Sales</Button>
        </form>
      </Card>
    </AppShell>
  );
}
