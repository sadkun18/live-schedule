import { cn } from "@/lib/cn";
import type { ScheduleStatus } from "@/lib/types";

const styles: Record<ScheduleStatus, string> = {
  scheduled: "bg-blue-50 text-blue-700",
  live: "bg-green-50 text-green-700",
  completed: "bg-zinc-100 text-zinc-600",
  cancelled: "bg-red-50 text-red-600",
};

const labels: Record<ScheduleStatus, string> = {
  scheduled: "Terjadwal",
  live: "Live",
  completed: "Selesai",
  cancelled: "Batal",
};

export function StatusBadge({ status }: { status: ScheduleStatus }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status])}>
      {labels[status]}
    </span>
  );
}
