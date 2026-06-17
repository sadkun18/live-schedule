import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSchedules, getSaleByScheduleId } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { ScheduleCard } from "@/components/ScheduleCard";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PenLine } from "lucide-react";

export default async function StreamerSchedulesPage() {
  const session = await getSession();
  if (!session || session.role !== "streamer") redirect("/streamer/login");

  const schedules = getSchedules({ streamerId: session.streamerId });

  return (
    <AppShell role="streamer">
      <PageHeader title="Jadwal Saya" subtitle="Semua jadwal live streaming Anda" />

      <div className="space-y-3">
        {schedules.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Belum ada jadwal</p>
        ) : (
          schedules.map((s) => {
            const sale = getSaleByScheduleId(s.id);
            const canInput =
              !sale && (s.status === "completed" || s.status === "live" || new Date(s.end_at) <= new Date());

            return (
              <Card key={s.id} className="space-y-3">
                <ScheduleCard schedule={s} showStreamer={false} />
                {sale ? (
                  <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">Sales tercatat</p>
                      <p className="text-lg font-bold text-green-700">{formatCurrency(sale.amount)}</p>
                    </div>
                    <Link href={`/streamer/schedules/${s.id}`}>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </Link>
                  </div>
                ) : canInput ? (
                  <Link href={`/streamer/schedules/${s.id}`}>
                    <Button className="w-full">
                      <PenLine className="h-4 w-4" /> Input Sales
                    </Button>
                  </Link>
                ) : (
                  <p className="text-center text-xs text-zinc-400">Menunggu live selesai</p>
                )}
              </Card>
            );
          })
        )}
      </div>
    </AppShell>
  );
}
