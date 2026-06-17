import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSales } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateShort } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function SalesPage({ searchParams }: { searchParams?: { date?: string } }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/admin/login");

  // support filtering by a single date (YYYY-MM-DD)
  const date = searchParams?.date;
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
      <PageHeader title="Laporan Sales" subtitle="Semua sales dari streamer" />

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs font-medium uppercase text-zinc-400">Total Sales</p>
          <p className="text-xl font-bold text-zinc-900">{formatCurrency(totalAmount)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-zinc-400">Total Pesanan</p>
          <p className="text-xl font-bold text-zinc-900">{totalOrders}</p>
        </Card>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <form method="get" className="flex items-center gap-2">
          <label className="text-sm text-zinc-600">Filter hari:</label>
          <input type="date" name="date" defaultValue={date ?? ""} className="rounded-xl border border-zinc-200 px-3 py-2" />
          <Button type="submit" variant="secondary" size="sm">Terapkan</Button>
          <Link href="/admin/sales">
            <Button variant="ghost" size="sm">Reset</Button>
          </Link>
        </form>

        <div className="ml-auto">
          <Link href={`/api/export-sales${date ? `?date=${date}` : ""}`}>
            <Button variant="ghost">Export CSV</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {sales.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Belum ada data sales</p>
        ) : (
          sales.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-zinc-900">{s.schedule_title}</p>
                  <p className="text-sm text-violet-600">{s.streamer_name}</p>
                  <p className="mt-1 text-xs text-zinc-400">{formatDateShort(s.start_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(s.amount)}</p>
                  <p className="text-xs text-zinc-500">{s.order_count} pesanan</p>
                </div>
              </div>
              {s.notes && <p className="mt-2 text-sm text-zinc-500 border-t border-zinc-50 pt-2">{s.notes}</p>}
              {s.screenshot && (
                <div className="mt-3">
                  <p className="text-xs text-zinc-400 mb-1">Bukti</p>
                  <img src={`/${s.screenshot}`} alt="screenshot" className="max-h-40 rounded-md object-contain" />
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
