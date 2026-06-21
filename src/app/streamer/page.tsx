import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSchedules, getSales } from "@/lib/db";
import { AppShell, LogoutButton, PageHeader } from "@/components/layout/AppShell";
import { ScheduleCard } from "@/components/ScheduleCard";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";
import { streamerLogout } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { DollarSign } from "lucide-react";

export default async function StreamerDashboard() {
  const session = await getSession();
  if (!session || session.role !== "streamer") redirect("/streamer/login");

  const upcoming = getSchedules({ streamerId: session.streamerId, status: "scheduled" }).slice(0, 3);
  const sales = getSales({ streamerId: session.streamerId });
  const totalSales = sales.reduce((sum, s) => sum + s.amount, 0);
  const needsSalesInput = getSchedules({ streamerId: session.streamerId }).filter(
    (s) => s.status === "completed" || (s.status === "scheduled" && new Date(s.end_at) < new Date())
  );

  return (
    <AppShell role="streamer">
      <div className="flex items-start justify-between">
        <PageHeader
          title={`Halo, ${session.streamerName}!`}
          subtitle="Jadwal live & input sales Anda"
        />
        <LogoutButton action={streamerLogout} />
      </div>

      <Card className="mb-6 flex items-center gap-4 bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0">
        <DollarSign className="h-10 w-10 opacity-80" />
        <div>
          <p className="text-sm opacity-80">Total Sales Anda</p>
          <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
          <p className="text-xs opacity-70">{sales.length} live selesai</p>
        </div>
      </Card>

      {needsSalesInput.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-medium text-amber-800">Perlu input sales!</p>
          <p className="mt-1 text-sm text-amber-700">
            Anda punya {needsSalesInput.length} live yang belum dilaporkan.
          </p>
          <Link href="/streamer/schedules">
            <Button variant="secondary" size="sm" className="mt-3">
              Input Sales Sekarang
            </Button>
          </Link>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900">Jadwal Mendatang</h2>
        <Link href="/streamer/schedules">
          <Button variant="ghost" size="sm">Lihat semua</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Tidak ada jadwal mendatang</p>
        ) : (
          upcoming.map((s) => (
            <ScheduleCard key={s.id} schedule={s} showStreamer={false} href={`/streamer/schedules/${s.id}`} />
          ))
        )}
      </div>
    </AppShell>
  );
}
