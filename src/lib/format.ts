import { format, parseISO, isToday, isTomorrow } from "date-fns";
import { id } from "date-fns/locale";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return `Hari ini, ${format(date, "HH:mm", { locale: id })}`;
  if (isTomorrow(date)) return `Besok, ${format(date, "HH:mm", { locale: id })}`;
  return format(date, "EEE, d MMM yyyy HH:mm", { locale: id });
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), "d MMM yyyy", { locale: id });
}

export function formatTimeRange(start: string, end: string): string {
  const s = parseISO(start);
  const e = parseISO(end);
  return `${format(s, "HH:mm")} – ${format(e, "HH:mm")}`;
}

export function toDatetimeLocalValue(iso: string): string {
  const d = parseISO(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
