import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants/status";
import type { ApplicationStatus } from "@/lib/zod/application.schema";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  if (!config) return null;

  return (
    <Badge 
      variant={config.variant} 
      className={cn(config.className, "font-medium border", className)}
    >
      {config.label}
    </Badge>
  );
}
