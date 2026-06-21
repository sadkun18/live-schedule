import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardStats, getSchedules } from "@/lib/db";
import { AppShell, LogoutButton, PageHeader } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ScheduleCard";
import { ScheduleCard } from "@/components/ScheduleCard";
import { formatCurrency } from "@/lib/format";
import { adminLogout } from "./actions";
import { Users, Calendar, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  const stats = getDashboardStats();
  const upcoming = getSchedules({ status: "scheduled" }).slice(0, 5);

  return (
    <AppShell role="admin">
      <div className="flex items-start justify-between">
        <PageHeader title="Dashboard" subtitle="Ringkasan live streaming shop" />
        <LogoutButton action={adminLogout} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatCard label="Streamer Aktif" value={String(stats.totalStreamers)} icon={Users} />
        <StatCard label="Live Hari Ini" value={String(stats.todaySchedules)} icon={Clock} />
        <StatCard label="Jadwal Mendatang" value={String(stats.upcomingSchedules)} icon={Calendar} />
        <StatCard
          label="Sales Bulan Ini"
          value={formatCurrency(stats.monthSalesTotal)}
          sub={`${stats.monthOrderCount} pesanan`}
          icon={DollarSign}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-zinc-900">Jadwal Mendatang</h2>
        <Link href="/admin/schedules">
          <Button variant="ghost" size="sm">Lihat semua</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Belum ada jadwal. Buat jadwal baru!</p>
        ) : (
          upcoming.map((s) => (
            <ScheduleCard key={s.id} schedule={s} href={`/admin/schedules?id=${s.id}`} />
          ))
        )}
      </div>
    </AppShell>
  );
}
