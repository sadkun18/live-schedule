import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSales } from "@/lib/db";
import { AppShell, PageHeader } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDateShort } from "@/lib/format";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default async function StreamerSalesPage() {
  const session = await getSession();
  if (!session || session.role !== "streamer") redirect("/streamer/login");

  const sales = getSales({ streamerId: session.streamerId });
  const totalAmount = sales.reduce((sum, s) => sum + s.amount, 0);
  const totalOrders = sales.reduce((sum, s) => sum + s.order_count, 0);

  return (
    <AppShell role="streamer">
      <div className="mb-4 flex items-center justify-between">
        <PageHeader title="Riwayat Sales" subtitle="Semua laporan sales Anda" />
        <Link href="/streamer/sales/input">
          <Button variant="ghost">Input Sales</Button>
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs font-medium uppercase text-zinc-400">Total</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(totalAmount)}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-zinc-400">Pesanan</p>
          <p className="text-xl font-bold text-zinc-900">{totalOrders}</p>
        </Card>
      </div>

      <div className="space-y-3">
        {sales.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-400">Belum ada sales tercatat</p>
        ) : (
          sales.map((s) => (
            <Card key={s.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-zinc-900">{s.schedule_title}</p>
                  <p className="text-xs text-zinc-400">{formatDateShort(s.start_at)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(s.amount)}</p>
                  <p className="text-xs text-zinc-500">{s.order_count} pesanan</p>
                </div>
              </div>
                {s.notes && <p className="mt-2 text-sm text-zinc-500">{s.notes}</p>}
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
