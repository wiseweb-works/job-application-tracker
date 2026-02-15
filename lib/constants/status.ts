import type { ApplicationStatus } from "@/lib/zod/application.schema";

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  className: string;
}

export const STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  APPLIED: {
    label: "Applied",
    variant: "default",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  INTERVIEW: {
    label: "Interview",
    variant: "default",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  OFFER: {
    label: "Offer",
    variant: "default",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  REJECTED: {
    label: "Rejected",
    variant: "destructive",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  GHOSTED: {
    label: "Ghosted",
    variant: "secondary",
    className: "bg-neutral-500/15 text-neutral-400 border-neutral-500/30",
  },
};
