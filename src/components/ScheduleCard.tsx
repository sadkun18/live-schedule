import { Card } from "./ui/Card";
import { StatusBadge } from "./ui/Badge";
import { formatDate, formatTimeRange } from "@/lib/format";
import type { ScheduleWithStreamer } from "@/lib/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function ScheduleCard({
  schedule,
  href,
  showStreamer = true,
}: {
  schedule: ScheduleWithStreamer;
  href?: string;
  showStreamer?: boolean;
}) {
  const content = (
    <Card className="flex items-center gap-3 transition-shadow hover:shadow-md">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusBadge status={schedule.status} />
          <span className="text-xs text-zinc-400">{schedule.platform}</span>
        </div>
        <p className="mt-1.5 font-semibold text-zinc-900 truncate">{schedule.title}</p>
        {showStreamer && (
          <p className="text-sm text-violet-600">{schedule.streamer_name}</p>
        )}
        <p className="mt-1 text-sm text-zinc-500">{formatDate(schedule.start_at)}</p>
        <p className="text-xs text-zinc-400">{formatTimeRange(schedule.start_at, schedule.end_at)}</p>
      </div>
      {href && <ChevronRight className="h-5 w-5 shrink-0 text-zinc-300" />}
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-violet-400" />}
      </div>
      <p className="text-2xl font-bold text-zinc-900">{value}</p>
      {sub && <p className="text-xs text-zinc-500">{sub}</p>}
    </Card>
  );
}
