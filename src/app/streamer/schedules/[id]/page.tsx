import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getScheduleById, getSaleByScheduleId } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, formatTimeRange } from "@/lib/format";
import { submitSalesAction } from "../../actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function StreamerScheduleDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (!session || session.role !== "streamer") redirect("/streamer/login");

  const { id } = await params;
  const { error } = await searchParams;
  const schedule = getScheduleById(Number(id));
  if (!schedule || schedule.streamer_id !== session.streamerId) notFound();

  const existingSale = getSaleByScheduleId(schedule.id);

  return (
    <AppShell role="streamer" showNav={false}>
      <Link
        href="/streamer/schedules"
        className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      <PageHeader
        title={existingSale ? "Edit Sales" : "Input Sales"}
        subtitle={schedule.title}
      />

      <Card className="mb-6 space-y-2">
        <div className="flex items-center gap-2">
          <StatusBadge status={schedule.status} />
          <span className="text-sm text-zinc-500">{schedule.platform}</span>
        </div>
        <p className="text-sm text-zinc-600">{formatDate(schedule.start_at)}</p>
        <p className="text-xs text-zinc-400">{formatTimeRange(schedule.start_at, schedule.end_at)}</p>
        {schedule.notes && <p className="text-sm text-zinc-500 border-t border-zinc-50 pt-2">{schedule.notes}</p>}
      </Card>

      <Card>
        <form action={submitSalesAction} className="space-y-4">
          <input type="hidden" name="schedule_id" value={schedule.id} />
          {error === "invalid" && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">Jumlah sales tidak valid</p>
          )}
          <Input
            label="Total Sales (Rp)"
            name="amount"
            type="number"
            inputMode="numeric"
            min="0"
            step="1000"
            placeholder="500000"
            defaultValue={existingSale?.amount ?? ""}
            required
          />
          <Input
            label="Jumlah Pesanan"
            name="order_count"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="25"
            defaultValue={existingSale?.order_count ?? ""}
          />
          <Input
            label="Catatan (opsional)"
            name="notes"
            placeholder="Produk terlaris, kendala, dll."
            defaultValue={existingSale?.notes ?? ""}
          />
          <Button type="submit" className="w-full">
            {existingSale ? "Perbarui Sales" : "Kirim Sales"}
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
