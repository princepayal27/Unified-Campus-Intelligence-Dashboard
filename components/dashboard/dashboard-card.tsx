import { type LucideIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function DashboardCard({
  title,
  icon: Icon,
  children,
  className,
  href,
}: DashboardCardProps) {
  
  const CardContent = (
    <div
      className={cn(
        "group h-full rounded-default bg-surface border border-border p-4 md:p-5",
        "shadow-soft transition-all duration-200",
        href && "hover:bg-surface-hover hover:border-accent/30 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-default bg-accent/15 flex items-center justify-center">
            <Icon className="h-4 w-4 text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>

        {href && (
          <ArrowUpRight className="h-4 w-4 text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all duration-200" />
        )}
      </div>

      <div>{children}</div>
    </div>
  );

  if (href) {
    return <Link href={href} className="block h-full">{CardContent}</Link>;
  }

  return CardContent;
}