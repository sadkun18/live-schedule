import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const hasBg = className?.includes("bg-");
  return (
    <div className={cn("rounded-2xl border border-zinc-100 p-4 shadow-sm", !hasBg && "bg-white", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("font-semibold text-zinc-900", className)}>{children}</h3>;
}
