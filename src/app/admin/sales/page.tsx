import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSales } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { StatCard } from "@/components/ScheduleCard";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SalesCard } from "@/components/Sales/SalesCard";
import { DollarSign, ShoppingBag, Download, Filter, RotateCcw } from "lucide-react";

export default async function SalesPage({ searchParams }: { searchParams?: { date?: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  const resolvedSearchParams = await searchParams;
  const date = resolvedSearchParams?.date;
  
  let from: string | undefined;
  let to: string | undefined;
  if (date) {
    from = new Date(`${date}T00:00:00`).toISOString();
    to = new Date(`${date}T23:59:59`).toISOString();
  }

  const sales = getSales({ from, to });
  const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalOrders = sales.reduce((sum, s) => sum + s.order_count, 0);

  return (
    <AppShell role="admin">
      <div className="flex items-start justify-between">
        <PageHeader title="Laporan Sales" subtitle="Pantau performa live streaming Anda" />
        <Link href={`/api/export-sales${date ? `?date=${date}` : ""}`}>
          <Button variant="primary" size="sm" className="hidden sm:flex gap-2 rounded-xl border-zinc-200">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <StatCard 
          label="Total Omzet" 
          value={formatCurrency(totalAmount)} 
          icon={DollarSign}
          className="bg-zinc-900 text-white border-0"
        />
        <StatCard 
          label="Total Pesanan" 
          value={String(totalOrders)} 
          icon={ShoppingBag}
          className="bg-violet-600 text-white border-0 shadow-lg shadow-violet-200"
        />
      </div>

      <div className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-zinc-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
            <Filter className="h-4 w-4 text-violet-600" />
            Filter Laporan
          </div>
          <form method="get" className="flex flex-1 flex-wrap items-center gap-3">
            <input 
              type="date" 
              name="date" 
              defaultValue={date ?? ""} 
              className="flex-1 min-w-[150px] rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20" 
            />
            <div className="flex gap-2">
              <Button type="submit" className="rounded-xl px-6">Terapkan</Button>
              <Link href="/admin/sales">
                <Button variant="ghost" size="md" className="rounded-xl border border-zinc-100">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </form>
          <Link href={`/api/export-sales${date ? `?date=${date}` : ""}`} className="sm:hidden">
            <Button variant="primary" className="w-full gap-2 rounded-xl border-zinc-200">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-bold text-zinc-900">Riwayat Penjualan</h2>
          <span className="text-xs font-medium text-zinc-400">{sales.length} Entri</span>
        </div>
        
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-50 text-zinc-300">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <p className="font-medium text-zinc-900">Belum ada data sales</p>
            <p className="text-sm text-zinc-500">Data akan muncul setelah streamer input hasil live.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sales.map((s) => (
              <SalesCard key={s.id} sale={s} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
