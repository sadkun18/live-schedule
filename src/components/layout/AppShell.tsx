import Link from "next/link";
import { cn } from "@/lib/cn";
import { Calendar, LayoutDashboard, Users, DollarSign, LogOut } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/schedules", label: "Jadwal", icon: Calendar },
  { href: "/admin/streamers", label: "Streamer", icon: Users },
  { href: "/admin/sales", label: "Sales", icon: DollarSign },
];

const streamerLinks = [
  { href: "/streamer", label: "Beranda", icon: LayoutDashboard },
  { href: "/streamer/schedules", label: "Jadwal", icon: Calendar },
  { href: "/streamer/sales", label: "Sales", icon: DollarSign },
];

export function BottomNav({ role }: { role: "admin" | "streamer" }) {
  const links = role === "admin" ? adminLinks : streamerLinks;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur-md safe-bottom">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-1 flex-col items-center gap-0.5 py-2 text-zinc-500 transition-colors hover:text-violet-600"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-zinc-500">{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

export function AppShell({
  children,
  role,
  showNav = true,
}: {
  children: React.ReactNode;
  role?: "admin" | "streamer";
  showNav?: boolean;
}) {
  return (
    <div className={cn("mx-auto min-h-full w-full max-w-lg bg-zinc-50", showNav && "pb-20")}>
      <div className="px-4 py-6">{children}</div>
      {showNav && role && <BottomNav role={role} />}
    </div>
  );
}

export function LogoutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700"
      >
        <LogOut className="h-4 w-4" />
        Keluar
      </button>
    </form>
  );
}
